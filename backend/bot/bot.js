const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const usersPath = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

// Initialize Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Xem hồ sơ của bạn trong The Besties Gang')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('edit-profile')
    .setDescription('Chỉnh sửa hồ sơ của bạn')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Tên hiển thị mới')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('character')
        .setDescription('Vai trò/Character mới (ví dụ: Xạ thủ / Hậu cần)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('bio')
        .setDescription('Tiểu sử mới')
        .setRequired(false))
    .toJSON(),
];

// Register Slash Commands (only if tokens are provided)
if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CLIENT_ID) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  (async () => {
    try {
      console.log('🔄 Đang đăng ký slash commands...');

      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands },
      );

      console.log('✅ Slash commands đã được đăng ký!');
    } catch (error) {
      console.error('❌ Lỗi đăng ký commands:', error);
    }
  })();
} else {
  console.warn('⚠️  DISCORD_BOT_TOKEN hoặc DISCORD_CLIENT_ID chưa được cấu hình. Slash commands sẽ không được đăng ký.');
}

// Bot ready event
client.once('ready', () => {
  console.log(`🤖 Bot Discord "${client.user.tag}" đã sẵn sàng!`);
  console.log(`📊 Bot đang hoạt động trên ${client.guilds.cache.size} server(s)`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    if (commandName === 'profile') {
      const users = loadUsers();
      const member = users.users.find(u => u.discordId === user.id);

      if (!member) {
        return await interaction.reply({
          content: '❌ Bạn chưa được đăng ký trong hệ thống. Vui lòng liên hệ Leader để được thêm vào.',
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0xFF5FAF)
        .setTitle(`📋 Hồ sơ: ${member.name}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '👤 Tên', value: member.name || 'Chưa cập nhật', inline: true },
          { name: '🎭 Vai trò', value: member.character || 'Chưa cập nhật', inline: true },
          { name: '🆔 Discord ID', value: member.discordId || 'N/A', inline: true },
          { name: '📧 Email', value: member.email || 'N/A', inline: true },
          { name: '👑 Quyền', value: member.role === 'leader' ? '👑 Leader' : '👥 Member', inline: true },
          { name: '📅 Ngày tạo', value: member.createdAt ? new Date(member.createdAt).toLocaleDateString('vi-VN') : 'N/A', inline: true }
        )
        .setFooter({ text: 'The Besties Gang • FiveM' })
        .setTimestamp();

      if (member.bio) {
        embed.setDescription(member.bio);
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (commandName === 'edit-profile') {
      const users = loadUsers();
      const memberIndex = users.users.findIndex(u => u.discordId === user.id);

      if (memberIndex === -1) {
        return await interaction.reply({
          content: '❌ Bạn chưa được đăng ký trong hệ thống. Vui lòng liên hệ Leader để được thêm vào.',
          ephemeral: true
        });
      }

      const name = interaction.options.getString('name');
      const character = interaction.options.getString('character');
      const bio = interaction.options.getString('bio');

      if (!name && !character && !bio) {
        return await interaction.reply({
          content: '❌ Vui lòng cung cấp ít nhất một thông tin để cập nhật (name, character, hoặc bio).',
          ephemeral: true
        });
      }

      const updates = [];
      if (name) {
        users.users[memberIndex].name = name;
        updates.push(`✅ Tên: ${name}`);
      }
      if (character) {
        users.users[memberIndex].character = character;
        updates.push(`✅ Vai trò: ${character}`);
      }
      if (bio) {
        users.users[memberIndex].bio = bio;
        updates.push(`✅ Tiểu sử: ${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}`);
      }

      saveUsers(users);

      const embed = new EmbedBuilder()
        .setColor(0x51CF66)
        .setTitle('✅ Hồ sơ đã được cập nhật!')
        .setDescription(updates.join('\n'))
        .setFooter({ text: 'The Besties Gang • FiveM' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error('Lỗi xử lý command:', error);
    await interaction.reply({
      content: '❌ Đã xảy ra lỗi khi xử lý lệnh. Vui lòng thử lại sau.',
      ephemeral: true
    });
  }
});

// Login bot (only if token is provided)
if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN).catch(error => {
    console.error('❌ Lỗi đăng nhập bot:', error);
    // Don't exit process, just log error
    console.warn('⚠️  Bot sẽ không hoạt động. Kiểm tra DISCORD_BOT_TOKEN trong .env');
  });
} else {
  console.warn('⚠️  DISCORD_BOT_TOKEN chưa được cấu hình. Bot sẽ không hoạt động.');
}

module.exports = client;

