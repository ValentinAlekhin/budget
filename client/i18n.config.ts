interface Locale {
  common: {
    add: string
    remove: string
    register: string
    logout: string
    login: string
    update: string
    updating: string
    costs: string
    incoming: string
    sum: string
    settings: string
    edit: string
    delete: string
    amount: string
    type: string
    comment: string
    category: string
    confirmRemove: string
    close: string
    name: string
    plan: string
    icon: string
    network: string
    server: string
    currentBalance: string
    balance: string
    totalSum: string
    noRecords: string
    submit: string
    language: string
    username: string
    password: string
    email: string
    cancel: string
    confirmLogout: string
    quarter: string
    day: string
    week: string
    year: string
    month: string
    selectColor: string
    color: string
    planPeriod: string
  }
  range: {
    currentYear: string
    currentQuarter: string
    currentMonth: string
    currentDay: string
    last30days: string
  }
  record: {
    edit: string
  }
  category: {
    add: string
  }
  icon: {
    resource: string
  }
  validation: {
    required: string
    taken: string
  }
}

const messages: Record<string, Locale> = {
  ru: {
    common: {
      add: 'Добавить',
      remove: 'Удалить',
      register: 'Регистрация',
      logout: 'Выход',
      login: 'Вход',
      update: 'Обновить',
      updating: 'Обновление',
      costs: 'Расходы',
      incoming: 'Доходы',
      sum: 'Сумма',
      settings: 'Настройки',
      edit: 'Редактировать',
      delete: 'Удалить',
      amount: 'Сумма',
      type: 'Тип',
      comment: 'Комментарий',
      category: 'Категория',
      confirmRemove: 'Подтвердить удаление',
      close: 'Закрыть',
      name: 'Имя',
      plan: 'План',
      icon: 'Иконка',
      network: 'Сеть',
      server: 'Сервер',
      currentBalance: 'Текущий баланс',
      balance: 'Баланс',
      totalSum: 'Общая сумма',
      noRecords: 'Нет записей',
      submit: 'Подтвердить',
      language: 'Язык',
      username: 'Логин',
      password: 'Пароль',
      email: 'Почта',
      cancel: 'Отмена',
      confirmLogout: 'Подтвердите выход',
      quarter: 'квартал',
      day: 'день',
      week: 'неделя',
      year: 'год',
      month: 'месяц',
      selectColor: 'Выберите цвет',
      color: 'Цвет',
      planPeriod: 'Период плана',
    },
    range: {
      currentYear: 'Текущий год',
      currentQuarter: 'Текущий квартал',
      currentMonth: 'Текущий месяц',
      currentDay: 'Текущий день',
      last30days: 'Последние 30 дней',
    },
    record: {
      edit: 'Редактирование записи от {date}',
    },
    category: {
      add: 'Добавить категорию',
    },
    icon: {
      resource:
        'Поиск иконок <a href="https://icon-sets.iconify.design/" target="_blank" class="text-cyan-500 underline">тут</a>',
    },
    validation: {
      required: 'Обязательно для заполнения',
      taken: 'Уже занято',
    },
  },
  en: {
    common: {
      add: 'Add',
      remove: 'Remove',
      register: 'Register',
      logout: 'Logout',
      login: 'Login',
      update: 'Update',
      updating: 'Updating',
      costs: 'Costs',
      incoming: 'Incoming',
      sum: 'Sum',
      settings: 'Settings',
      edit: 'Edit',
      delete: 'Delete',
      amount: 'Amount',
      type: 'Type',
      comment: 'Comment',
      category: 'Category',
      confirmRemove: 'Confirm Removal',
      close: 'Close',
      name: 'Name',
      plan: 'Plan',
      icon: 'Icon',
      network: 'Network',
      server: 'Server',
      currentBalance: 'Current balance',
      balance: 'Balance',
      totalSum: 'Total sum',
      noRecords: 'No records',
      submit: 'Submit',
      language: 'Language',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      cancel: 'Cancel',
      confirmLogout: 'Confirm logout',
      quarter: 'quarter',
      day: 'day',
      week: 'week',
      year: 'year',
      month: 'month',
      selectColor: 'Select color',
      color: 'Color',
      planPeriod: 'Plan period',
    },
    range: {
      currentYear: 'Current Year',
      currentQuarter: 'Current Quarter',
      currentMonth: 'Current Month',
      currentDay: 'Current Day',
      last30days: 'Last 30 Days',
    },
    record: {
      edit: 'Editing record from {date}',
    },
    category: {
      add: 'Add category',
    },
    icon: {
      resource:
        'Icons search <a href="https://icon-sets.iconify.design/" target="_blank" class="text-cyan-500 underline">here</a>',
    },
    validation: {
      required: 'Required',
      taken: 'Already taken',
    },
  },
}

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
  },
  // @ts-ignore
  messages,
}))
