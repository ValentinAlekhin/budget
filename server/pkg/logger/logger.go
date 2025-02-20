package logger

import (
	"context"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// ZapLogger реализует интерфейс Logger с использованием zap
type ZapLogger struct {
	logger *zap.Logger
	ctx    context.Context
}

// New создает новый экземпляр ZapLogger
func New() (Logger, error) {
	config := zap.NewProductionConfig()
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	zapLogger, err := config.Build(
		zap.AddCaller(),
		zap.AddCallerSkip(1),
	)

	if err != nil {
		return nil, err
	}
	return &ZapLogger{logger: zapLogger, ctx: context.Background()}, nil
}

func (l *ZapLogger) Debug(msg string, fields map[string]interface{}) {
	l.addContextCommonFields(fields)

	l.logger.Debug("", zap.Any("args", fields))
}

func (l *ZapLogger) Info(msg string, fields map[string]interface{}) {
	l.addContextCommonFields(fields)

	l.logger.Info("", zap.Any("args", fields))
}

func (l *ZapLogger) Warn(msg string, fields map[string]interface{}) {
	l.addContextCommonFields(fields)

	l.logger.Warn("", zap.Any("args", fields))
}

func (l *ZapLogger) Error(msg string, fields map[string]interface{}) {
	l.addContextCommonFields(fields)

	l.logger.Error("", zap.Any("args", fields))
}

func (l *ZapLogger) Fatal(msg string, fields map[string]interface{}) {
	l.addContextCommonFields(fields)

	l.logger.Fatal("", zap.Any("args", fields))
}

func (l *ZapLogger) addContextCommonFields(fields map[string]interface{}) {
	
}
