package config

func GetAll() (*DB, *Server, *JWT, *Telegram, error) {
	db, err := NewDB()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	jwt, err := NewJWT()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	server, err := NewServer()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	telegram, err := NewTelegram()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	return db, server, jwt, telegram, nil
}
