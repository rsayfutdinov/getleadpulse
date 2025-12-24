/**
 * LeadPulse - UTM & Lead Attribution Tracker
 * A lightweight JavaScript plugin for tracking UTM parameters and lead attribution
 */

(function() {
  // Configuration
  const config = {
    storageKey: 'LeadPulse_attribution',
    cookieExpiry: 30, // days
    autoFill: true,
    debug: false,
    hiddenFieldPrefix: 'LeadPulse_', // Prefix for hidden fields
    platforms: {
      webflow: true,
      jotform: true,
      typeform: true,
      hubspot: true,
      mailchimp: true
    },
    // Custom fields configuration
    customFields: {},
    // Tracking configuration
    trackingEndpoint: window.location.origin + '/api/tracking',
    apiKey: null, // Will be set from script tag
    enableTracking: true // Enable/disable tracking
  };

  // Comprehensive traffic source database
  const trafficSources = {
    search: {
      google: [
        'google.ac', 'google.ad', 'google.ae', 'google.al', 'google.am', 'google.as', 
        'google.at', 'google.az', 'google.ba', 'google.be', 'google.bf', 'google.bg', 
        'google.bi', 'google.bj', 'google.bs', 'google.bt', 'google.by', 'google.ca', 
        'google.cat', 'google.cc', 'google.cd', 'google.cf', 'google.cg', 'google.ch', 
        'google.ci', 'google.cl', 'google.cm', 'google.cn', 'google.co.ao', 'google.co.bw', 
        'google.co.ck', 'google.co.cr', 'google.co.id', 'google.co.il', 'google.co.in', 
        'google.co.jp', 'google.co.ke', 'google.co.kr', 'google.co.ls', 'google.co.ma', 
        'google.co.mz', 'google.co.nz', 'google.co.th', 'google.co.tz', 'google.co.ug', 
        'google.co.uk', 'google.co.uz', 'google.co.ve', 'google.co.vi', 'google.co.za', 
        'google.co.zm', 'google.co.zw', 'google.com', 'google.com.af', 'google.com.ag', 
        'google.com.ai', 'google.com.ar', 'google.com.au', 'google.com.bd', 'google.com.bh', 
        'google.com.bn', 'google.com.bo', 'google.com.br', 'google.com.by', 'google.com.bz', 
        'google.com.co', 'google.com.cu', 'google.com.cy', 'google.com.do', 'google.com.ec', 
        'google.com.eg', 'google.com.et', 'google.com.fj', 'google.com.gh', 'google.com.gi', 
        'google.com.gt', 'google.com.hk', 'google.com.jm', 'google.com.kh', 'google.com.kw', 
        'google.com.lb', 'google.com.lc', 'google.com.ly', 'google.com.mm', 'google.com.mt', 
        'google.com.mx', 'google.com.my', 'google.com.na', 'google.com.nf', 'google.com.ng', 
        'google.com.ni', 'google.com.np', 'google.com.om', 'google.com.pa', 'google.com.pe', 
        'google.com.pg', 'google.com.ph', 'google.com.pk', 'google.com.pr', 'google.com.py', 
        'google.com.qa', 'google.com.sa', 'google.com.sb', 'google.com.sg', 'google.com.sl', 
        'google.com.sv', 'google.com.tj', 'google.com.tn', 'google.com.tr', 'google.com.tw', 
        'google.com.ua', 'google.com.uy', 'google.com.vc', 'google.com.vn', 'google.cv', 
        'google.cz', 'google.de', 'google.dj', 'google.dk', 'google.dm', 'google.dz', 
        'google.ee', 'google.es', 'google.fi', 'google.fm', 'google.fr', 'google.ga', 
        'google.gd', 'google.ge', 'google.gf', 'google.gg', 'google.gl', 'google.gm', 
        'google.gp', 'google.gr', 'google.gy', 'google.hn', 'google.hr', 'google.ht', 
        'google.hu', 'google.ie', 'google.im', 'google.io', 'google.iq', 'google.is', 
        'google.it', 'google.je', 'google.jo', 'google.kg', 'google.ki', 'google.kz', 
        'google.la', 'google.li', 'google.lk', 'google.lt', 'google.lu', 'google.lv', 
        'google.md', 'google.me', 'google.mg', 'google.mk', 'google.ml', 'google.mn', 
        'google.ms', 'google.mu', 'google.mv', 'google.mw', 'google.ne', 'google.nl', 
        'google.no', 'google.nr', 'google.nu', 'google.pl', 'google.pn', 'google.ps', 
        'google.pt', 'google.ro', 'google.rs', 'google.ru', 'google.rw', 'google.sc', 
        'google.se', 'google.sh', 'google.si', 'google.sk', 'google.sm', 'google.sn', 
        'google.so', 'google.st', 'google.td', 'google.tg', 'google.tk', 'google.tl', 
        'google.tm', 'google.tn', 'google.to', 'google.tt', 'google.us', 'google.vg', 
        'google.vu', 'google.ws'
      ],
      bing: ['bing.com'],
      yahoo: ['yahoo.co.jp', 'yahoo.com'],
      duckduckgo: ['duckduckgo.com'],
      yandex: ['yandex.by', 'yandex.com', 'yandex.com.tr', 'yandex.kz', 'yandex.ru', 'yandex.ua'],
      baidu: ['baidu.cn', 'baidu.co.th', 'baidu.com']
    },
    social: {
      facebook: ['facebook.com', 'fb.com', 'fb.me', 'fbcdn.net'],
      instagram: ['instagram.com', 'instagr.am'],
      twitter: ['twitter.com', 'x.com', 't.co'],
      linkedin: ['linkedin.com', 'lnkd.in'],
      youtube: ['youtube.com', 'youtu.be'],
      pinterest: ['pinterest.com', 'pin.it'],
      reddit: ['reddit.com', 'redd.it'],
      tiktok: ['tiktok.com', 'vm.tiktok.com'],
      snapchat: ['snapchat.com', 'snap.app'],
      whatsapp: ['whatsapp.com', 'wa.me'],
      telegram: ['telegram.org', 't.me'],
      tumblr: ['tumblr.com', 'tmblr.co'],
      vimeo: ['vimeo.com', 'vimeo.tv'],
      flickr: ['flickr.com', 'flic.kr'],
      medium: ['medium.com', 'medium.app'],
      quora: ['quora.com', 'qr.ae'],
      vk: ['vk.com', 'vk.cc'],
      wechat: ['wechat.com', 'weixin.qq.com'],
      line: ['line.me', 'line-app.com'],
      kakao: ['kakao.com', 'kakaocorp.com']
    },
    email: {
      gmail: ['mail.google.com', 'gmail.com'],
      outlook: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
      yahoo: ['mail.yahoo.com', 'yahoo.com'],
      aol: ['mail.aol.com', 'aol.com'],
      protonmail: ['protonmail.com', 'proton.me'],
      zoho: ['zoho.com', 'zoho.eu'],
      icloud: ['icloud.com', 'me.com'],
      yandex: ['mail.yandex.com', 'yandex.com']
    },
    referral: {
      github: ['github.com', 'github.io'],
      stackoverflow: ['stackoverflow.com', 'stackexchange.com'],
      wordpress: ['wordpress.com', 'wp.com'],
      medium: ['medium.com', 'medium.app'],
      dev: ['dev.to', 'dev.to'],
      producthunt: ['producthunt.com', 'ph.to'],
      hackernews: ['news.ycombinator.com', 'ycombinator.com'],
      dribbble: ['dribbble.com', 'drbl.in'],
      behance: ['behance.net', 'be.net'],
      dribbble: ['dribbble.com', 'drbl.in'],
      codepen: ['codepen.io', 'cdpn.io'],
      jsfiddle: ['jsfiddle.net', 'jsfiddle.net'],
      codesandbox: ['codesandbox.io', 'codesandbox.io'],
      repl: ['repl.it', 'replit.com'],
      glitch: ['glitch.com', 'glitch.me']
    },
    paid: {
      google_ads: ['google.com/ads', 'ads.google.com'],
      facebook_ads: ['facebook.com/ads', 'ads.facebook.com'],
      instagram_ads: ['instagram.com/ads', 'ads.instagram.com'],
      linkedin_ads: ['linkedin.com/ads', 'ads.linkedin.com'],
      twitter_ads: ['twitter.com/ads', 'ads.twitter.com'],
      pinterest_ads: ['pinterest.com/ads', 'ads.pinterest.com'],
      tiktok_ads: ['tiktok.com/ads', 'ads.tiktok.com'],
      snapchat_ads: ['snapchat.com/ads', 'ads.snapchat.com'],
      quora_ads: ['quora.com/ads', 'ads.quora.com'],
      reddit_ads: ['reddit.com/ads', 'ads.reddit.com'],
      bing_ads: ['bing.com/ads', 'ads.bing.com'],
      yahoo_ads: ['yahoo.com/ads', 'ads.yahoo.com']
    }
  };

  // Utility functions
  const utils = {
    log: function(...args) {
      if (config.debug) {
        console.log('[LeadPulse]', ...args);
      }
    },

    getQueryParam: function(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },

    getReferrer: function() {
      // Check if we have a test referrer set via custom event
      if (window.LeadPulse_test_referrer) {
        return window.LeadPulse_test_referrer;
      }
      return document.referrer;
    },

    getLandingPage: function() {
      return window.location.pathname + window.location.search;
    },

    // Determine the landing page group (e.g., /blog/post-1 becomes /blog)
    getLandingPageGroup: function() {
      const path = window.location.pathname;
      // Extract the top-level directory
      const pathParts = path.split('/').filter(Boolean);
      return pathParts.length > 0 ? `/${pathParts[0]}` : '/';
    },

    setCookie: function(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "; expires=" + date.toUTCString();
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },

    getCookie: function(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    setLocalStorage: function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        utils.log('Error setting localStorage:', e);
      }
    },

    getLocalStorage: function(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        utils.log('Error getting localStorage:', e);
        return null;
      }
    },

    // Enhanced channel detection with drill-down approach
    determineChannel: function(utmParams, referrer) {
      // If we have a UTM source, use that as the channel
      if (utmParams.utm_source) {
        // Check if the UTM source matches any known traffic sources
        const source = utmParams.utm_source.toLowerCase();
        
        // Check for search engines
        for (const engine in trafficSources.search) {
          if (source.includes(engine)) {
            return {
              channel: 'search',
              subChannel: engine,
              source: source
            };
          }
        }
        
        // Check for social platforms
        for (const platform in trafficSources.social) {
          if (source.includes(platform)) {
            return {
              channel: 'social',
              subChannel: platform,
              source: source
            };
          }
        }
        
        // Check for email platforms
        for (const email in trafficSources.email) {
          if (source.includes(email)) {
            return {
              channel: 'email',
              subChannel: email,
              source: source
            };
          }
        }
        
        // Check for referral sites
        for (const site in trafficSources.referral) {
          if (source.includes(site)) {
            return {
              channel: 'referral',
              subChannel: site,
              source: source
            };
          }
        }
        
        // Check for paid advertising
        for (const ad in trafficSources.paid) {
          if (source.includes(ad.replace('_ads', ''))) {
            return {
              channel: 'paid',
              subChannel: ad,
              source: source
            };
          }
        }
        
        // If we can't categorize the UTM source, use it directly
        return {
          channel: 'other',
          subChannel: source,
          source: source
        };
      }
      
      // Otherwise, try to determine from referrer
      if (!referrer) return {
        channel: 'direct',
        subChannel: 'direct',
        source: 'direct'
      };
      
      try {
        const referrerUrl = new URL(referrer);
        const hostname = referrerUrl.hostname.toLowerCase();
        const path = referrerUrl.pathname.toLowerCase();
        
        // Check for search engines
        for (const engine in trafficSources.search) {
          if (trafficSources.search[engine].some(domain => hostname.includes(domain))) {
            return {
              channel: 'search',
              subChannel: engine,
              source: hostname
            };
          }
        }
        
        // Check for social platforms
        for (const platform in trafficSources.social) {
          if (trafficSources.social[platform].some(domain => hostname.includes(domain))) {
            return {
              channel: 'social',
              subChannel: platform,
              source: hostname
            };
          }
        }
        
        // Check for email platforms
        for (const email in trafficSources.email) {
          if (trafficSources.email[email].some(domain => hostname.includes(domain))) {
            return {
              channel: 'email',
              subChannel: email,
              source: hostname
            };
          }
        }
        
        // Check for referral sites
        for (const site in trafficSources.referral) {
          if (trafficSources.referral[site].some(domain => hostname.includes(domain))) {
            return {
              channel: 'referral',
              subChannel: site,
              source: hostname
            };
          }
        }
        
        // Check for paid advertising
        for (const ad in trafficSources.paid) {
          if (trafficSources.paid[ad].some(domain => hostname.includes(domain) || path.includes(domain))) {
            return {
              channel: 'paid',
              subChannel: ad,
              source: hostname
            };
          }
        }
        
        // If we can't determine, use the hostname
        return {
          channel: 'other',
          subChannel: 'unknown',
          source: hostname
        };
      } catch (e) {
        utils.log('Error parsing referrer URL:', e);
        return {
          channel: 'other',
          subChannel: 'unknown',
          source: referrer
        };
      }
    },

    // Check if element is in an iframe
    isInIframe: function(element) {
      try {
        return element.ownerDocument !== document;
      } catch (e) {
        return true;
      }
    },

    // Get all forms including those in iframes
    getAllForms: function() {
      const forms = Array.from(document.getElementsByTagName('form'));
      
      // Try to get forms from iframes
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframeForms = iframes[i].contentDocument.getElementsByTagName('form');
          for (let j = 0; j < iframeForms.length; j++) {
            forms.push(iframeForms[j]);
          }
        } catch (e) {
          utils.log('Cannot access iframe content due to same-origin policy:', e);
        }
      }
      
      return forms;
    }
  };

  // UTM Parameters to track
  const utmParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  // Main tracking function
  function trackAttribution() {
    // Verify API key first
    if (!config.apiKey) {
      utils.log('Cannot track attribution: No API key available');
      return null;
    }
    
    // Get existing data
    const existingData = utils.getLocalStorage(config.storageKey);
    
    const attributionData = {
      timestamp: new Date().toISOString(),
      landing_page: utils.getLandingPage(),
      landing_page_group: utils.getLandingPageGroup(),
      referrer: utils.getReferrer(),
      utm_parameters: {},
      api_key: config.apiKey // Store API key in attribution data
    };
    
    // Only set first_landing_page if this is the first visit or we don't have it stored
    if (!existingData || !existingData.first_landing_page) {
      attributionData.first_landing_page = attributionData.landing_page;
    } else {
      // Keep the existing first_landing_page
      attributionData.first_landing_page = existingData.first_landing_page;
    }

    // Collect UTM parameters
    let hasUtmParameters = false;
    utmParams.forEach(param => {
      const value = utils.getQueryParam(param);
      if (value) {
        attributionData.utm_parameters[param] = value;
        hasUtmParameters = true;
      }
    });

    // Determine channel with drill-down approach
    const channelData = utils.determineChannel(
      attributionData.utm_parameters, 
      attributionData.referrer
    );
    
    // Add channel data to attribution data
    attributionData.channel = channelData.channel;
    attributionData.subChannel = channelData.subChannel;
    attributionData.source = channelData.source;

    // If no UTM parameters were found, infer them from referrer data
    if (!hasUtmParameters) {
      // Try to infer utm_source from the referrer domain or source
      if (!attributionData.utm_parameters.utm_source) {
        if (attributionData.source && attributionData.source !== 'direct') {
          attributionData.utm_parameters.utm_source = attributionData.source;
        } else if (attributionData.referrer) {
          try {
            const referrerUrl = new URL(attributionData.referrer);
            attributionData.utm_parameters.utm_source = referrerUrl.hostname.replace('www.', '');
          } catch (e) {
            utils.log('Error parsing referrer URL for utm_source inference:', e);
          }
        } else {
          attributionData.utm_parameters.utm_source = 'direct';
        }
      }
      
      // Infer utm_medium from the channel
      if (!attributionData.utm_parameters.utm_medium) {
        switch (attributionData.channel) {
          case 'search':
            attributionData.utm_parameters.utm_medium = 'organic';
            break;
          case 'social':
            attributionData.utm_parameters.utm_medium = 'social';
            break;
          case 'email':
            attributionData.utm_parameters.utm_medium = 'email';
            break;
          case 'referral':
            attributionData.utm_parameters.utm_medium = 'referral';
            break;
          case 'paid':
            attributionData.utm_parameters.utm_medium = 'cpc';
            break;
          case 'direct':
            attributionData.utm_parameters.utm_medium = 'direct';
            break;
          default:
            attributionData.utm_parameters.utm_medium = 'referral';
        }
      }
      
      // Set a basic campaign value if none exists
      if (!attributionData.utm_parameters.utm_campaign) {
        if (attributionData.channel === 'search') {
          attributionData.utm_parameters.utm_campaign = 'organic_search';
        } else if (attributionData.channel === 'direct') {
          attributionData.utm_parameters.utm_campaign = 'direct';
        } else {
          attributionData.utm_parameters.utm_campaign = attributionData.channel + '_referral';
        }
      }
    }

    // Store the data
    utils.setLocalStorage(config.storageKey, attributionData);
    utils.setCookie(config.storageKey, JSON.stringify(attributionData), config.cookieExpiry);

    utils.log('Attribution data stored:', attributionData);
    return attributionData;
  }

  // Send tracking event to server
  function sendTrackingEvent(eventType, additionalData) {
    console.log('[LeadPulse] sendTrackingEvent called:', eventType);
    
    if (!config.enableTracking) {
      console.log('[LeadPulse] Tracking is disabled');
      return;
    }

    if (!config.apiKey) {
      console.log('[LeadPulse] No API key found, skipping tracking');
      return;
    }

    console.log('[LeadPulse] API key present:', config.apiKey.substring(0, 8) + '...');

    const attributionData = utils.getLocalStorage(config.storageKey) || {};
    const payload = {
      apiKey: config.apiKey,
      eventType: eventType, // 'init' or 'lead'
      domain: window.location.hostname,
      landingPage: window.location.pathname + window.location.search,
      referrer: utils.getReferrer(),
      channel: attributionData.channel || null,
      subChannel: attributionData.subChannel || null,
      utmSource: attributionData.utm_parameters?.utm_source || null,
      utmMedium: attributionData.utm_parameters?.utm_medium || null,
      utmCampaign: attributionData.utm_parameters?.utm_campaign || null,
      utmTerm: attributionData.utm_parameters?.utm_term || null,
      utmContent: attributionData.utm_parameters?.utm_content || null,
      timestamp: new Date().toISOString()
    };

    // Merge additional data if provided
    if (additionalData) {
      Object.assign(payload, additionalData);
    }

    // Determine endpoint based on event type
    const endpoint = eventType === 'lead' ? '/lead' : '/init';
    const fullUrl = config.trackingEndpoint + endpoint;

    console.log('[LeadPulse] Sending tracking request to:', fullUrl);
    console.log('[LeadPulse] Payload:', payload);

    // Send to tracking endpoint
    fetch(fullUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('[LeadPulse] Response status:', response.status);
      if (!response.ok) {
        return response.text().then(text => {
          console.error('[LeadPulse] Tracking request failed:', response.status, text);
        });
      } else {
        console.log('[LeadPulse] ✅ Tracking event sent successfully:', eventType);
      }
    })
    .catch(err => {
      console.error('[LeadPulse] Tracking error:', err);
    });
  }

  // Auto-fill forms with attribution data
  function autoFillForms() {
    console.log('DEBUG: autoFillForms called');
    
    // Get the attribution data
    const data = getAttributionData();
    
    // If no data, exit early
    if (!data) {
      console.log('DEBUG: No attribution data found');
      return;
    }
    
    console.log('DEBUG: Attribution data:', data);
    
    // Find all forms in the document (both direct in the page and in iframes)
    populateFormsInDocument(document, data);
    
    // Look for iframes and try to access their forms
    try {
      const iframes = document.querySelectorAll('iframe');
      console.log(`DEBUG: Found ${iframes.length} iframes`);
      
      iframes.forEach((iframe, index) => {
        console.log(`DEBUG: Processing iframe ${index + 1}/${iframes.length}`);
        processIframe(iframe, data);
      });
    } catch (error) {
      console.error('DEBUG: Error processing iframes:', error);
    }
  }

  // Populate forms in the given document with attribution data
  function populateFormsInDocument(doc, data) {
    try {
      const forms = doc.forms;
      console.log(`DEBUG: Found ${forms.length} forms in document`);
      
      for (let i = 0; i < forms.length; i++) {
        console.log(`DEBUG: Processing form ${i + 1}/${forms.length}`);
        populateForm(forms[i], data);
      }
    } catch (error) {
      console.error('DEBUG: Error populating forms:', error);
    }
  }

  // Populate a specific form with attribution data
  function populateForm(form, data) {
    console.log('DEBUG: populateForm called');
    
    // Ensure the attribution data fields exist in the form
    addHiddenFieldsToForm(form, data);
    
    // Map attribution data field names to values
    const fieldMappings = [
      { fieldName: `${config.hiddenFieldPrefix}utm_source`, value: data.utm_source || '' },
      { fieldName: `${config.hiddenFieldPrefix}utm_medium`, value: data.utm_medium || '' },
      { fieldName: `${config.hiddenFieldPrefix}utm_campaign`, value: data.utm_campaign || '' },
      { fieldName: `${config.hiddenFieldPrefix}utm_term`, value: data.utm_term || '' },
      { fieldName: `${config.hiddenFieldPrefix}utm_content`, value: data.utm_content || '' },
      { fieldName: `${config.hiddenFieldPrefix}channel`, value: data.channel || '' },
      { fieldName: `${config.hiddenFieldPrefix}subchannel`, value: data.subchannel || '' },
      { fieldName: `${config.hiddenFieldPrefix}landing_page`, value: data.landing_page || '' },
      { fieldName: `${config.hiddenFieldPrefix}landing_page_group`, value: data.landing_page_group || '' },
      { fieldName: `${config.hiddenFieldPrefix}first_landing_page`, value: data.first_landing_page || '' },
      { fieldName: `${config.hiddenFieldPrefix}referrer`, value: data.referrer || '' }
    ];
    
    // Fill each field
    for (const mapping of fieldMappings) {
      const field = findOrCreateField(form, mapping.fieldName, mapping.value);
      if (field) {
        console.log(`DEBUG: Setting ${mapping.fieldName} to "${mapping.value}"`);
        field.value = mapping.value;
      }
    }
  }

  // Add hidden fields to a form
  function addHiddenFieldsToForm(form, data) {
    if (!form) return;

    // Check for the single hidden field marker
    const markerField = form.querySelector('input[name="LeadPulse_hidden_field"]');
    if (markerField) {
      // Remove the marker field
      markerField.remove();
      
      // Add all the necessary tracking fields
      addTrackingFieldsToForm(form, data);
      return;
    }

    // Create hidden fields for each UTM parameter
    Object.entries(data.utm_parameters).forEach(([key, value]) => {
      // Find field using case-insensitive and "contains" matching
      // This will match fields like q18_leadpulse_utm_source
      const fieldName = `${config.hiddenFieldPrefix}${key}`;
      const input = findOrCreateField(form, fieldName, value);
      if (input) input.value = value;
    });

    // Add channel fields
    ['channel', 'subChannel', 'source'].forEach(field => {
      const fieldName = `${config.hiddenFieldPrefix}${field}`;
      const input = findOrCreateField(form, fieldName, data[field]);
      if (input) input.value = data[field];
    });

    // Add landing page, landing page group, first landing page, and referrer
    ['landing_page', 'landing_page_group', 'first_landing_page', 'referrer'].forEach(field => {
      const fieldName = `${config.hiddenFieldPrefix}${field}`;
      const input = findOrCreateField(form, fieldName, data[field]);
      if (input) input.value = data[field];
    });
    
    // Add custom fields if configured
    if (config.customFields && Object.keys(config.customFields).length > 0) {
      Object.entries(config.customFields).forEach(([fieldName, fieldValue]) => {
        // Check if the field already exists using case-insensitive matching
        const fullFieldName = `${config.hiddenFieldPrefix}${fieldName}`;
        let value;
        if (typeof fieldValue === 'function') {
          value = fieldValue(data);
        } else {
          value = fieldValue;
        }
        
        const input = findOrCreateField(form, fullFieldName, value);
        if (input) input.value = value;
      });
    }
    
    utils.log(`Added hidden fields to form: ${form.id || 'unnamed form'}`);
  }

  // Helper function to find or create a field with flexible matching
  function findOrCreateField(form, fieldName, value) {
    console.log(`DEBUG: findOrCreateField called for field: ${fieldName} with value: ${value}`);
    
    // First try exact match
    let input = form.querySelector(`input[name="${fieldName}"]`);
    if (input) {
      console.log(`DEBUG: Found exact match for ${fieldName}:`, input.name);
      return input;
    }
    
    // Extract the base part of the field name (after LeadPulse_)
    const fieldNameBase = fieldName.replace(new RegExp(`^${config.hiddenFieldPrefix}`), '').toLowerCase();
    
    // Try strict matching that avoids field confusion
        const allInputs = form.querySelectorAll('input[type="hidden"]');
    console.log(`DEBUG: Searching among ${allInputs.length} hidden fields`);
    
    // Map of UTM parameters to ensure we match the right fields to right values
    const utmFieldMap = {
      'utm_source': ['source', 'utm_source'],
      'utm_medium': ['medium', 'utm_medium'],
      'utm_campaign': ['campaign', 'utm_campaign'],
      'utm_term': ['term', 'utm_term'],
      'utm_content': ['content', 'utm_content'],
      'channel': ['channel'],
      'subchannel': ['subchannel'],
      'landing_page': ['landing_page', 'landingpage'],
      'landing_page_group': ['landing_page_group', 'landingpagegroup'],
      'first_landing_page': ['first_landing_page', 'firstlandingpage'],
      'referrer': ['referrer']
    };
    
    // Get the specific identifiers for this field
    const fieldIdentifiers = utmFieldMap[fieldNameBase] || [fieldNameBase];
    
    // Look for fields that match only the specific identifiers for this field type
        for (const inp of allInputs) {
      const name = inp.name.toLowerCase();
      
      // Check if field contains any of the specific identifiers
      const matchesField = fieldIdentifiers.some(identifier => 
        name.includes(identifier) && 
        // Additional checks to avoid partial matches
        (name.includes(`_${identifier}`) || name.includes(`_${identifier}_`) || name.endsWith(identifier))
      );
      
      if (matchesField) {
        console.log(`DEBUG: Found strict match for ${fieldName}: ${inp.name}`);
        return inp;
      }
    }
    
    // Not found, create new field
    console.log(`DEBUG: No matching field found, creating new field: ${fieldName}`);
          input = document.createElement('input');
          input.type = 'hidden';
    input.name = fieldName;
          form.appendChild(input);
    return input;
  }

  // Helper function to add all tracking fields to a form
  function addTrackingFieldsToForm(form, attributionData) {
    // Add UTM parameters
    Object.entries(attributionData.utm_parameters).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `${config.hiddenFieldPrefix}${key}`;
      input.value = value;
      form.appendChild(input);
    });

    // Add channel fields
    ['channel', 'subChannel', 'source'].forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `${config.hiddenFieldPrefix}${field}`;
      input.value = attributionData[field];
      form.appendChild(input);
    });

    // Add landing page, landing page group, first landing page and referrer
    ['landing_page', 'landing_page_group', 'first_landing_page', 'referrer'].forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `${config.hiddenFieldPrefix}${field}`;
      input.value = attributionData[field];
      form.appendChild(input);
    });
    
    // Add custom fields if configured
    if (config.customFields && Object.keys(config.customFields).length > 0) {
      Object.entries(config.customFields).forEach(([fieldName, fieldValue]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = `${config.hiddenFieldPrefix}${fieldName}`;
        
        // Set the field value - can be a function or a static value
        if (typeof fieldValue === 'function') {
          input.value = fieldValue(attributionData);
        } else {
          input.value = fieldValue;
        }
        
        form.appendChild(input);
      });
    }
    
    utils.log(`Added tracking fields to form: ${form.id || 'unnamed form'}`);
  }

  // Add hidden fields to a specific form
  function addHiddenFields(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      utils.log(`Form with ID ${formId} not found`);
      return;
    }

    addHiddenFieldsToForm(form);
  }

  // Initialize tracking
  function init() {
    utils.log('Initializing LeadPulse...');
    
    // Check for API key in script tag
    // document.currentScript doesn't work after script execution
    // So we search for the embed.js script tag
    const scriptTag = (function() {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('embed.js')) {
          return scripts[i];
        }
      }
      // Fallback to last script
      return scripts[scripts.length - 1];
    })();
    
    let apiKey = null;
    console.log('[LeadPulse] Starting API key detection...');
    console.log('[LeadPulse] document.currentScript:', document.currentScript);
    
    if (scriptTag) {
      try {
        console.log('[LeadPulse] Script tag found');
        console.log('[LeadPulse] Script src:', scriptTag.src);
        console.log('[LeadPulse] Script src type:', typeof scriptTag.src);
        
        if (!scriptTag.src) {
          console.error('[LeadPulse] Script tag has no src attribute!');
        } else {
          const urlParts = scriptTag.src.split('?');
          console.log('[LeadPulse] URL parts count:', urlParts.length);
          console.log('[LeadPulse] URL parts:', urlParts);
          
          const queryString = urlParts.length > 1 ? urlParts[1] : '';
          console.log('[LeadPulse] Query string:', queryString);
          console.log('[LeadPulse] Query string length:', queryString.length);
          
          const urlParams = new URLSearchParams(queryString);
          console.log('[LeadPulse] URLSearchParams object:', urlParams);
          console.log('[LeadPulse] All params:', Array.from(urlParams.entries()));
          
          apiKey = urlParams.get('api_key');
          console.log('[LeadPulse] Parsed API key:', apiKey);
          console.log('[LeadPulse] API key type:', typeof apiKey);
          console.log('[LeadPulse] API key length:', apiKey ? apiKey.length : 0);
          
          if (apiKey) {
            config.apiKey = apiKey;
            console.log('[LeadPulse] ✅ API key found in script tag:', apiKey.substring(0, 10) + '...');
          } else {
            console.error('[LeadPulse] ❌ API key not found in query string');
          }
        }
      } catch (e) {
        console.error('[LeadPulse] Error parsing script URL:', e);
        console.error('[LeadPulse] Error stack:', e.stack);
      }
    } else {
      console.error('[LeadPulse] Script tag not found');
    }
    
    // Early exit if no API key is available
    if (!apiKey) {
      console.error('[LeadPulse] No API key provided. Waiting for manual configuration...');
      // Don't return early - allow manual configuration
      // return;
    }
    
    // Listen for custom events to set test referrer
    document.addEventListener('LeadPulse:setReferrer', function(event) {
      if (event.detail && event.detail.referrer) {
        window.LeadPulse_test_referrer = event.detail.referrer;
        utils.log('Test referrer set:', window.LeadPulse_test_referrer);
      } else {
        window.LeadPulse_test_referrer = null;
        utils.log('Test referrer cleared');
      }
    });
    
    // Only track if we don't have data or if it's a new session
    const existingData = utils.getLocalStorage(config.storageKey);
    if (!existingData || !existingData.utm_parameters || !existingData.utm_parameters.utm_source) {
      console.log('DEBUG: No existing attribution data, tracking now');
      trackAttribution();
    } else {
      console.log('DEBUG: Using existing attribution data:', existingData);
    }

    // Send init tracking event to server
    sendTrackingEvent('init');

    // Auto-fill forms
    if (config.autoFill) {
      console.log('DEBUG: Auto-filling forms on init');
    autoFillForms();
      
      // Set a delay to check for forms that might load later
      setTimeout(function() {
        console.log('DEBUG: Rechecking for forms after delay');
        autoFillForms();
      }, 2000);
    }

    // Listen for form submissions
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        console.log('DEBUG: Form submission detected, adding hidden fields');
        const data = getAttributionData();
        addHiddenFieldsToForm(e.target, data);
        
        // Send lead tracking event to server
        sendTrackingEvent('lead', {
          formId: e.target.id || 'unknown',
          formAction: e.target.action || null
        });
      }
    });
    
    // Listen for dynamically added forms and iframes
    const observer = new MutationObserver(function(mutations) {
      let foundForms = false;
      let foundIframes = false;
      
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeName === 'FORM') {
            foundForms = true;
          } else if (node.nodeName === 'IFRAME') {
            foundIframes = true;
          } else if (node.querySelectorAll) {
            const forms = node.querySelectorAll('form');
            if (forms.length > 0) foundForms = true;
            
            const iframes = node.querySelectorAll('iframe');
            if (iframes.length > 0) foundIframes = true;
          }
        });
      });
      
      if (foundForms || foundIframes) {
        console.log('DEBUG: New form or iframe detected, refreshing attribution data');
        autoFillForms();
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also listen for message events from iframes requesting data
    window.addEventListener('message', function(event) {
      try {
        if (event.data && event.data.type === 'LeadPulse' && event.data.action === 'requestData') {
          console.log('DEBUG: Received request for data from iframe');
          const data = getAttributionData();
          event.source.postMessage({
            type: 'LeadPulse',
            action: 'receiveData',
            data: data
          }, '*');
        }
      } catch (e) {
        console.error('DEBUG: Error processing message event:', e);
      }
    });
  }

  // Expose public API
  window.LeadPulse = {
    init: function() {
      init();
    },
    track: function() {
      return config.apiKey ? trackAttribution() : console.error('[LeadPulse] Cannot track: No API key available');
    },
    getData: function() {
      if (!config.apiKey) {
        console.error('[LeadPulse] Cannot get data: No API key available');
        return null;
      }
      return utils.getLocalStorage(config.storageKey);
    },
    configure: function(options) {
      Object.assign(config, options);
      console.log('[LeadPulse] Configuration updated:', options);
      // If API key is now set and we haven't initialized, do it now
      if (options.apiKey && config.apiKey) {
        console.log('[LeadPulse] API key configured, re-initializing...');
        // Track attribution and send init event
        trackAttribution();
        sendTrackingEvent('init');
        // Setup form listeners if not already done
        if (config.autoFill) {
          autoFillForms();
        }
      }
    },
    addHiddenFields: function(formId) {
      if (!config.apiKey) {
        console.error('[LeadPulse] Cannot add fields: No API key available');
        return;
      }
      addHiddenFields(formId);
    },
    // Add a new method to get traffic source information
    getTrafficSource: function() {
      if (!config.apiKey) {
        console.error('[LeadPulse] Cannot get traffic source: No API key available');
        return null;
      }
      const data = utils.getLocalStorage(config.storageKey);
      if (!data) return null;
      
      return {
        channel: data.channel,
        subChannel: data.subChannel,
        source: data.source,
        utmSource: data.utm_parameters.utm_source || null,
        utmMedium: data.utm_parameters.utm_medium || null,
        utmCampaign: data.utm_parameters.utm_campaign || null,
        landingPage: data.landing_page || null,
        landingPageGroup: data.landing_page_group || null,
        firstLandingPage: data.first_landing_page || null,
        referrer: data.referrer || null
      };
    },
    // Add a method to set custom fields
    setCustomFields: function(customFields) {
      if (typeof customFields === 'object') {
        config.customFields = customFields;
        utils.log('Custom fields updated:', customFields);
        
        // Re-apply to all forms if autoFill is enabled
        if (config.autoFill) {
          autoFillForms();
        }
      } else {
        utils.log('Invalid custom fields format. Expected an object.');
      }
    }
  };

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Process an iframe to populate forms inside it
  function processIframe(iframe, data) {
    try {
      console.log('DEBUG: Processing iframe:', iframe.src);
      
      // Get attribution data
      const attributionData = data || getAttributionData();
      if (!attributionData) {
        console.log('DEBUG: No attribution data available');
        return;
      }
      
      // Just use the simple hash URL approach like attributer.js
      // This lets JotForm's default value system handle the field population
      if (iframe.src) {
        console.log('DEBUG: Using attributer.js hash approach');
        
        try {
          const url = new URL(iframe.src);
          
          // Build simple hash parameters that match default values in JotForm
          // JotForm will automatically map [parameter] in default values to these
          const hashParams = [
            // Core parameters
            `utm_source=${encodeURIComponent(attributionData.utm_source || '')}`,
            `utm_medium=${encodeURIComponent(attributionData.utm_medium || '')}`,
            `utm_campaign=${encodeURIComponent(attributionData.utm_campaign || '')}`,
            `utm_term=${encodeURIComponent(attributionData.utm_term || '')}`,
            `utm_content=${encodeURIComponent(attributionData.utm_content || '')}`,
            
            // Channel data
            `channel=${encodeURIComponent(attributionData.channel || '')}`,
            `subchannel=${encodeURIComponent(attributionData.subChannel || '')}`,
            `source=${encodeURIComponent(attributionData.source || '')}`,
            
            // Page data
            `landingpage=${encodeURIComponent(attributionData.landing_page || '')}`,
            `landingpagegroup=${encodeURIComponent(attributionData.landing_page_group || '')}`,
            `firstlandingpage=${encodeURIComponent(attributionData.first_landing_page || '')}`,
            `referrer=${encodeURIComponent(attributionData.referrer || '')}`
          ];
          
          // Set the hash and update the iframe - this is the key to the approach
          url.hash = '#' + hashParams.join('&');
          const newSrc = url.toString();
          
          console.log('DEBUG: Hash parameters set:', hashParams);
          console.log('DEBUG: New src:', newSrc);
          console.log('DEBUG: Old src:', iframe.src);
          if (newSrc !== iframe.src) {
            console.log('DEBUG: Updating iframe src with hash parameters');
            iframe.src = newSrc;
            
            // Try to reload the form after updating the src (exactly like attributer.js)
            if (window.tf) {
              console.log('DEBUG: Reloading form with window.tf.reload()');
              window.tf.reload();
            }
            
            // Also try to trigger form reset/reload event
            setTimeout(function() {
              try {
                // For JotForm, try to find and trigger the reload functionality
                if (window.JFForm) {
                  console.log('DEBUG: Reloading form with JFForm');
                  window.JFForm.reload();
                }
                
                // For iframe forms, try to access and reload content
                if (iframe.contentWindow) {
                  console.log('DEBUG: Sending reload message to iframe');
                  iframe.contentWindow.postMessage({ 
                    type: 'LeadPulse',
                    action: 'reload'
                  }, '*');
                }
              } catch (e) {
                console.log('DEBUG: Error during form reload:', e);
              }
            }, 1000); // Small delay to ensure iframe has updated
          }
        } catch (e) {
          console.error('DEBUG: Error setting hash parameters:', e);
        }
      }
    } catch (error) {
      console.error('DEBUG: Error in processIframe:', error);
    }
  }

  // Listen for postMessage from iframes
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'LeadPulse') {
      console.log('DEBUG: Received message from iframe:', event.data);
      if (event.data.action === 'requestData') {
        // Send attribution data to requesting iframe
        const data = getAttributionData();
        event.source.postMessage({
          type: 'LeadPulse',
          action: 'populateFields',
          data: data
        }, '*');
      }
    }
  });

  // Get attribution data from storage and format it for use
  function getAttributionData() {
    try {
      // Get the raw data from localStorage or cookie
      const rawData = utils.getLocalStorage(config.storageKey);
      if (!rawData) {
        console.log('DEBUG: No attribution data found in storage');
        return null;
      }
      
      console.log('DEBUG: Raw attribution data:', rawData);
      
      // Create a properly formatted data object
      const formattedData = {
        // Channel information
        channel: rawData.channel || '',
        subChannel: rawData.subChannel || '',
        source: rawData.source || '',
        
        // UTM parameters - extract directly from utm_parameters object
        utm_source: rawData.utm_parameters?.utm_source || '',
        utm_medium: rawData.utm_parameters?.utm_medium || '',
        utm_campaign: rawData.utm_parameters?.utm_campaign || '',
        utm_term: rawData.utm_parameters?.utm_term || '',
        utm_content: rawData.utm_parameters?.utm_content || '',
        
        // Landing page information
        landing_page: rawData.landing_page || '',
        landing_page_group: rawData.landing_page_group || '',
        first_landing_page: rawData.first_landing_page || '',
        
        // Referrer information
        referrer: rawData.referrer || '',
        
        // Include the original timestamp
        timestamp: rawData.timestamp || new Date().toISOString()
      };
      
      // Store original utm_parameters object for reference
      formattedData.utm_parameters = rawData.utm_parameters || {};
      
      console.log('DEBUG: Formatted attribution data:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('DEBUG: Error getting attribution data:', error);
      return null;
    }
  }
})(); 