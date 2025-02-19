package cache

import (
	"github.com/dgraph-io/ristretto/v2"
)

type Cache interface {
	Set(key string, value string)
	Get(key string) (value string, found bool)
	Del(key string)
	Clear()
	Close()
}

type Service struct {
	cache *ristretto.Cache[string, string]
}

func NewService() (*Service, error) {
	cache, err := ristretto.NewCache(&ristretto.Config[string, string]{
		NumCounters: 1e7,
		MaxCost:     1 << 30,
		BufferItems: 64,
	})
	if err != nil {
		return nil, err
	}
	return &Service{cache: cache}, nil
}

func (s *Service) Set(key string, value string) {
	s.cache.Set(key, value, 0)
	s.cache.Wait()
}

func (s *Service) Get(key string) (value string, found bool) {
	value, found = s.cache.Get(key)
	return value, found
}

func (s *Service) Del(key string) {
	s.cache.Del(key)
}

func (s *Service) Clear() {
	s.cache.Clear()
}

func (s *Service) Close() {
	s.cache.Close()
}
