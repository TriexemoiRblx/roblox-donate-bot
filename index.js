const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Bot đã đăng nhập: ${client.user.tag}`);
});

const formatTop = (data, unit) => {
  return Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([user, amount], i) => `Top ${i + 1}: ${user} – ${amount} ${unit}`)
    .join('\n') || 'Chưa có ai donate';
};

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'donatetop') {
    const wescan = JSON.parse(fs.readFileSync('wescan.json'));
    const playerduo = JSON.parse(fs.readFileSync('playerduo.json'));
    const buymycoffee = JSON.parse(fs.readFileSync('buymycoffee.json'));

    const reply = `🏆 **Top Donate Tháng Này**\n\n**Wescan**\n${formatTop(wescan, '₫')}\n\n**PlayerDuo**\n${formatTop(playerduo, '💎')}\n\n**BuyMeACoffee**\n${formatTop(buymycoffee, '☕')}`;
    await interaction.reply(reply);
  }

  if (interaction.commandName === 'donatetopwescan') {
    const wescan = JSON.parse(fs.readFileSync('wescan.json'));
    await interaction.reply(`Top Wescan Donate Tháng Này Là:\n${formatTop(wescan, '₫')}`);
  }

  if (interaction.commandName === 'donatetopplayerduo') {
    const playerduo = JSON.parse(fs.readFileSync('playerduo.json'));
    await interaction.reply(`Top Donate PlayerDuo Tháng Này Là:\n${formatTop(playerduo, '💎')}`);
  }

  if (interaction.commandName === 'donatetopbuymycoffee') {
    const buymycoffee = JSON.parse(fs.readFileSync('buymycoffee.json'));
    await interaction.reply(`Top Donate BuyMeACoffee Tháng Này Là:\n${formatTop(buymycoffee, '☕')}`);
  }
});

client.login(process.env.TOKEN);

// Đăng ký lệnh slash
const commands = [
  new SlashCommandBuilder().setName('donatetop').setDescription('Hiển thị tổng hợp donate từ 3 nền tảng'),
  new SlashCommandBuilder().setName('donatetopwescan').setDescription('Hiển thị top donate Wescan'),
  new SlashCommandBuilder().setName('donatetopplayerduo').setDescription('Hiển thị top donate PlayerDuo'),
  new SlashCommandBuilder().setName('donatetopbuymycoffee').setDescription('Hiển thị top donate BuyMeACoffee')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ Slash command đã đăng ký!');
  } catch (err) {
    console.error('❌ Lỗi đăng ký slash command:', err);
  }
})();
