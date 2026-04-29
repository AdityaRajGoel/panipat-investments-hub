const submitToIndexNow = async () => {
  const payload = {
    host: "www.sphpnp.com",
    key: "f9f4dc4ccac44b7ba7c91c6bce9d00c1",
    keyLocation: "https://www.sphpnp.com/f9f4dc4ccac44b7ba7c91c6bce9d00c1.txt",
    urlList: [
      "https://www.sphpnp.com/",
      "https://www.sphpnp.com/about",
      "https://www.sphpnp.com/services",
      "https://www.sphpnp.com/unlisted-space",
      "https://www.sphpnp.com/open-account",
      "https://www.sphpnp.com/screener",
      "https://www.sphpnp.com/fno",
      "https://www.sphpnp.com/learn",
      "https://www.sphpnp.com/learn/recommendations",
      "https://www.sphpnp.com/52-week-tracker",
      "https://www.sphpnp.com/compare",
      "https://www.sphpnp.com/products",
      "https://www.sphpnp.com/depository-services",
      "https://www.sphpnp.com/brokerage-calculator",
      "https://www.sphpnp.com/margin-calculator",
      "https://www.sphpnp.com/team",
      "https://www.sphpnp.com/contact",
      "https://www.sphpnp.com/holidays",
      "https://www.sphpnp.com/careers",
      "https://www.sphpnp.com/privacy-policy",
      "https://www.sphpnp.com/cookie-policy"
    ]
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      console.log('Success (200): All URLs submitted successfully.');
    } else {
      console.error(`Error (${response.status}):`, response.statusText);
    }
  } catch (error) {
    console.error('Network or execution error during submission:', error);
  }
};

// Execute the function
submitToIndexNow();