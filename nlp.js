var natural = require('natural');
var classifier = new natural.BayesClassifier();
var verbInflector = new natural.PresentVerbInflector();

classifier.addDocument('расписание на завтра', 'schedule.atDay');
classifier.addDocument('расписание на сегодня', 'schedule.atDay');
classifier.addDocument('расписание на 15 октября', 'schedule.atDay');
classifier.addDocument('расписание на 10 число', 'schedule.atDay');
classifier.addDocument('расписание на 21.02', 'schedule.atDay');
classifier.addDocument('пары на сегодня', 'schedule.atDay');
classifier.addDocument('пары завтра', 'schedule.atDay');
classifier.addDocument('что по парам на завтра', 'schedule.atDay');
classifier.addDocument('что по парам на сегодня', 'schedule.atDay');
classifier.addDocument('шо по парам на завтра', 'schedule.atDay');
classifier.addDocument('чо по парам на сегодня', 'schedule.atDay');
classifier.addDocument('чо по парам завтра', 'schedule.atDay');
classifier.addDocument('чо завтра за пары', 'schedule.atDay');
classifier.addDocument('к какой паре завтра', 'schedule.atDay');
classifier.addDocument('завтра к какой паре', 'schedule.atDay');
classifier.addDocument('сегодня ко скольки', 'schedule.atDay');
classifier.addDocument('у нас есть пары?', 'schedule.atDay');
classifier.addDocument('какие у нас пары', 'schedule.atDay');

classifier.addDocument('где пара', 'schedule.where');
classifier.addDocument('куда идти', 'schedule.where');
classifier.addDocument('куды идти', 'schedule.where');
classifier.addDocument('какая аудитория', 'schedule.where');
classifier.addDocument('какая ауд', 'schedule.where');
classifier.addDocument('какой корпус', 'schedule.where');

classifier.addDocument('какая некст пара', 'schedule.next');
classifier.addDocument('где некст', 'schedule.next');
classifier.addDocument('некст пара', 'schedule.next');
classifier.addDocument('где следующая пара', 'schedule.next');
classifier.addDocument('чо дальше по парам', 'schedule.next');

classifier.train();

const datas = natural.PorterStemmerRu.tokenizeAndStem('расписание на 10 число');
datas.forEach((data) => {
  console.log(verbInflector.pluralize(data));
});
