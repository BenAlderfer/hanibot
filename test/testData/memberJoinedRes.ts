import { testUserId, testUserUsername } from './defaults';

export default {
  guild: {},
  joinedTimestamp: 1673909806991,
  nickname: null,
  _roles: [],
  user: {
    id: testUserId,
    bot: false,
    system: false,
    flags: 0,
    username: testUserUsername,
    discriminator: '5716',
    avatar: '776de7ec4d325393cfcf70aaa0ae6a52',
    createdTimestamp: 1451604725252,
    defaultAvatarURL: 'https://cdn.discordapp.com/embed/avatars/1.png',
    tag: `${testUserUsername}#5716`,
    avatarURL:
      'https://cdn.discordapp.com/avatars/132264546541764608/776de7ec4d325393cfcf70aaa0ae6a52.webp',
    displayAvatarURL:
      'https://cdn.discordapp.com/avatars/132264546541764608/776de7ec4d325393cfcf70aaa0ae6a52.webp'
  },
  avatar: null,
  client: {
    options: {
      intents: 2,
      closeTimeout: 5000,
      waitGuildTimeout: 15000,
      shardCount: 1,
      partials: [],
      failIfNotExists: true,
      presence: {
        status: 'online',
        user: {
          id: null
        }
      },
      sweepers: {
        threads: {
          interval: 3600,
          lifetime: 14400
        }
      },
      ws: {
        large_threshold: 50,
        compress: false,
        properties: {
          os: 'linux',
          browser: 'discord.js',
          device: 'discord.js'
        },
        version: 10,
        presence: {
          activities: [],
          afk: false,
          since: null,
          status: 'online'
        }
      },
      rest: {
        agent: {},
        api: 'https://discord.com/api',
        authPrefix: 'Bot',
        cdn: 'https://cdn.discordapp.com',
        headers: {},
        invalidRequestWarningInterval: 0,
        globalRequestsPerSecond: 50,
        offset: 50,
        rejectOnRateLimit: null,
        retries: 3,
        timeout: 15000,
        userAgentAppendix: 'Node.js v18.13.0',
        version: '10',
        hashSweepInterval: 14400000,
        hashLifetime: 86400000,
        handlerSweepInterval: 3600000
      },
      shards: [0]
    },
    rest: {
      cdn: {
        base: 'https://cdn.discordapp.com'
      },
      requestManager: {
        agent: {},
        globalRemaining: 49,
        globalDelay: null,
        globalReset: 1673910229319,
        hashes: ['GET:/gateway/bot'],
        handlers: ['Global(GET:/gateway/bot):global'],
        hashTimer: {},
        handlerTimer: {},
        options: {
          agent: {},
          api: 'https://discord.com/api',
          authPrefix: 'Bot',
          cdn: 'https://cdn.discordapp.com',
          headers: {},
          invalidRequestWarningInterval: 0,
          globalRequestsPerSecond: 50,
          offset: 50,
          rejectOnRateLimit: null,
          retries: 3,
          timeout: 15000,
          userAgentAppendix: 'Node.js v18.13.0',
          version: '10',
          hashSweepInterval: 14400000,
          hashLifetime: 86400000,
          handlerSweepInterval: 3600000
        }
      }
    },
    ws: {
      gateway: 'wss://gateway.discord.gg/',
      totalShards: 1,
      shards: [0],
      status: 0,
      destroyed: false,
      reconnecting: false
    },
    voice: {
      adapters: {}
    },
    shard: null,
    users: ['928447530956623902', '132264546541764608'],
    guilds: ['800439704075763722'],
    channels: [],
    sweepers: {
      options: {
        threads: {
          interval: 3600,
          lifetime: 14400
        }
      },
      intervals: {
        autoModerationRules: null,
        applicationCommands: null,
        bans: null,
        emojis: null,
        invites: null,
        guildMembers: null,
        messages: null,
        presences: null,
        reactions: null,
        stageInstances: null,
        stickers: null,
        threadMembers: null,
        threads: {},
        users: null,
        voiceStates: null
      }
    },
    user: '928447530956623902',
    application: '928447530956623902',
    readyTimestamp: 1673910228778
  }
};
