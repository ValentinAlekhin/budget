package record

type service struct {
}

func (s service) CreateOne(user *Record) error {
	return nil
}

func (s service) UpdateOne(user *Record) error {
	return nil
}

var Service = service{}
