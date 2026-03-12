const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type ChannelConfig = {
  key: string;
  name: string;
  channelId: string;
  liveUrl: string;
  channelUrl: string;
};

const CHANNELS: ChannelConfig[] = [
  {
    key: 'zee-business',
    name: 'Zee Business',
    channelId: 'UCkXopQ3ubd-rnXnStZqCl2w',
    liveUrl: 'https://www.youtube.com/@ZeeBusiness/live',
    channelUrl: 'https://www.youtube.com/@ZeeBusiness',
  },
  {
    key: 'cnbc-awaaz',
    name: 'CNBC Awaaz',
    channelId: 'UCQIycDaLsBpMKjOCeaKUYVg',
    liveUrl: 'https://www.youtube.com/@CNBCAwaaz/live',
    channelUrl: 'https://www.youtube.com/@CNBCAwaaz',
  },
];

const decodeXml = (value: string) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");

const extractTag = (xml: string, tagName: string) => {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`));
  return match?.[1] ?? null;
};

const parseLatestVideo = (xml: string) => {
  const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entryMatch) return null;

  const entry = entryMatch[1];
  const videoId = extractTag(entry, 'yt:videoId');
  if (!videoId) return null;

  const title = extractTag(entry, 'title');
  const publishedAt = extractTag(entry, 'published');
  const updatedAt = extractTag(entry, 'updated');

  return {
    videoId,
    title: title ? decodeXml(title) : null,
    publishedAt,
    updatedAt,
  };
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const channels = await Promise.all(
      CHANNELS.map(async (channel) => {
        try {
          const response = await fetch(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.channelId}`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } },
          );

          if (!response.ok) {
            throw new Error(`RSS fetch failed with status ${response.status}`);
          }

          const xml = await response.text();
          const latest = parseLatestVideo(xml);

          if (!latest) {
            throw new Error('No video found in RSS feed');
          }

          return {
            ...channel,
            status: 'ok',
            videoId: latest.videoId,
            title: latest.title,
            publishedAt: latest.publishedAt,
            updatedAt: latest.updatedAt,
            embedUrl: `https://www.youtube.com/embed/${latest.videoId}`,
            watchUrl: `https://www.youtube.com/watch?v=${latest.videoId}`,
          };
        } catch (channelError) {
          const errorMessage = channelError instanceof Error ? channelError.message : 'Unknown channel fetch error';
          return {
            ...channel,
            status: 'fallback',
            videoId: null,
            title: null,
            publishedAt: null,
            updatedAt: null,
            embedUrl: `https://www.youtube.com/embed/live_stream?channel=${channel.channelId}`,
            watchUrl: channel.liveUrl,
            error: errorMessage,
          };
        }
      }),
    );

    return new Response(
      JSON.stringify({ success: true, channels, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Failed to fetch live broadcasts:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch live broadcasts' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
