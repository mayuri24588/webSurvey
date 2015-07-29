var frisby = require('frisby');
frisby.create('Get Test')
  .get('http://localhost:3000/surveys/surveylist')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .toss();

frisby.create('Post Test')
  .post('http://localhost:3000/surveys/addsurvey', {
      gender     : "F",
    condition  : "Tired",
    state      : "4",
    reg_date   : Date(),
    })
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .toss();