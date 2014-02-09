exports.getDisclaimer = function(req, res) {
  res.render('disclaimer', {
    title: 'Disclaimer'
  });
};

exports.getAbout = function(req, res) {
  res.render('about', {
    title: 'About'
  });
};