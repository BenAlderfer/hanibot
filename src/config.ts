if (!process.env.TOKEN) {
  throw new Error('Missing required TOKEN environment variable');
}

export const BOT_TOKEN = process.env.TOKEN;
