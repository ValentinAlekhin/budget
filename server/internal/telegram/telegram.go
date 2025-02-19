package telegram

import (
	"budget/internal/config"
	"fmt"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/golang-module/carbon/v2"
	"github.com/robfig/cron/v3"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
)

type Bot struct {
	api      *tgbotapi.BotAPI
	config   *config.Telegram
	dbConfig *config.DB
}

func NewBot(cfg *config.Telegram, dbCfg *config.DB) error {
	api, err := tgbotapi.NewBotAPI(cfg.Token)
	if err != nil {
		return err
	}

	bot := &Bot{api: api, config: cfg, dbConfig: dbCfg}

	go func() {
		_ = bot.init()
	}()

	return nil
}

func (b Bot) init() error {
	slog.Info(fmt.Sprintf("Authorized on account: %s", b.api.Self.UserName))

	c := cron.New()
	_, err := c.AddFunc("0 0 * * *", b.backup)
	if err != nil {
		return err
	}
	c.Start()

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60
	updates := b.api.GetUpdatesChan(u)
	for update := range updates {
		if update.Message == nil {
			continue
		}

		if !update.Message.IsCommand() {
			continue
		}

		if update.Message.Chat.ID != b.config.AdminID {
			continue
		}

		switch update.Message.Command() {
		case "backup":
			b.backup()
		default:
			continue
		}
	}

	return nil
}

func (b Bot) backup() {
	chatId := b.config.AdminID

	directory, err := os.Getwd()
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = b.api.Send(msg)
		return
	}

	now := carbon.Now().Format("d-m-Y--H-i-s")
	fileName := fmt.Sprintf("budget-backup-%s.tar", now)
	dumpPath := filepath.Join(directory, fileName)
	cmd := exec.Command("pg_dump", b.dbConfig.GetUrl(), "-f", dumpPath, "-F", "t")
	err = cmd.Run()
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = b.api.Send(msg)
		return
	}

	msg := tgbotapi.NewDocument(chatId, tgbotapi.FilePath(dumpPath))
	_, err = b.api.Send(msg)
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = b.api.Send(msg)
	}

	err = os.Remove(dumpPath)
	if err != nil {
		msg := tgbotapi.NewMessage(chatId, err.Error())
		_, _ = b.api.Send(msg)
	}

}
