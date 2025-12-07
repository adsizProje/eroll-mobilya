/**
 * Oturma Grubu Lifecycle Hooks
 * Netlify build hook tetiklemesi için
 */

const triggerNetlifyBuild = async () => {
  const webhookUrl = process.env.NETLIFY_BUILD_HOOK;
  
  if (!webhookUrl) {
    console.warn('NETLIFY_BUILD_HOOK env variable is not set. Skipping build trigger.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trigger: 'strapi-content-update',
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log('Netlify build triggered successfully');
    } else {
      console.error('Failed to trigger Netlify build:', response.statusText);
    }
  } catch (error) {
    console.error('Error triggering Netlify build:', error);
  }
};

export default {
  async afterCreate() {
    await triggerNetlifyBuild();
  },

  async afterUpdate() {
    await triggerNetlifyBuild();
  },

  async afterDelete() {
    await triggerNetlifyBuild();
  },
};

