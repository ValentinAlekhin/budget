package telegram

import (
	"budget/config"
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/golang-module/carbon/v2"
	"github.com/robfig/cron/v3"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

type telegramBot struct {
	api *tgbotapi.BotAPI
}

func (tgBot telegramBot) Init() {
	bot, err := tgbotapi.NewBotAPI(config.Telegram.Token)
	if err != nil {
		panic(err)
	}

	tgBot.api = bot

	log.Printf("Authorized on account %s", tgBot.api.Self.UserName)

	c := cron.New()
	c.AddFunc("0 0 * * *", tgBot.backup)
	c.Start()

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	updates := tgBot.api.GetUpdatesChan(u)
	for update := range updates {
		if update.Message == nil {
			continue
		}

		if !update.Message.IsCommand() {
			continue
		}

		if update.Message.Chat.ID != config.Telegram.AdminID {
			continue
		}

		switch update.Message.Command() {
		case "backup":
			tgBot.backup()
		default:
			continue
		}

	}
}

func (tgBot telegramBot) backup() {
	chatId := config.Telegram.AdminID

	directory, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = tgBot.api.Send(msg)
		return
	}

	now := carbon.Now().Format("d-m-Y--H-i-s")
	fileName := fmt.Sprintf("budget-backup-%s.tar", now)
	dumpPath := filepath.Join(directory, fileName)
	cmd := exec.Command("pg_dump", config.DB.GetUrl(), "-f", dumpPath, "-F", "t")
	err = cmd.Run()
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = tgBot.api.Send(msg)
		return
	}

	msg := tgbotapi.NewDocument(chatId, tgbotapi.FilePath(dumpPath))
	_, err = tgBot.api.Send(msg)
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = tgBot.api.Send(msg)
	}

	err = os.Remove(dumpPath)
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = tgBot.api.Send(msg)
	}

}

var Bot telegramBot
