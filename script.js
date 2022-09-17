const req = new XMLHttpRequest();

req.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);

req.send();

req.onload = function () {
  const listParti = JSON.parse(req.responseText);

  const w = 950;
  const h = 600;
  const padding = {
    top: 80,
    bottom: 60,
    right: 70,
    left: 80 };


  const yearsSet = listParti.map(function (d, i) {
    return d.Year;
  });

  const xScale = d3.scaleLinear().
  domain([d3.min(yearsSet, d => d - 1),
  d3.max(yearsSet, d => d + 1)]).
  range([
  padding.left, w - padding.right]);


  const timerSet = listParti.map(function (d, i) {
    var timerSplit = d.Time.split(':');
    return new Date(1970, 0, 1, 0, timerSplit[0], timerSplit[1]);
  });

  const timerFormat = d3.timeFormat('%M:%S');

  const yScale = d3.scaleTime().
  domain([new Date(d3.min(timerSet)),
  new Date(d3.max(timerSet))]).
  range([padding.top, h - padding.bottom]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(timerFormat);

  const svg = d3.select('#svg-graph').
  append('svg').
  attr('width', w).
  attr('height', h);

  svg.append('g').
  attr('id', 'x-axis').
  call(xAxis).attr('transform', 'translate(0 , ' + (h - padding.bottom) + ')');

  svg.append('g').
  attr('id', 'y-axis').
  call(yAxis).
  attr('transform', 'translate(' + padding.left + ', 0)');

  svg.append('text').
  attr('id', 'title').
  attr('x', w / 11).
  attr('y', padding.top / 2 + 10).
  text('Doping Effects and Trend in Professional Bicycle Racing');

  svg.append('text').
  attr('class', 'y-axis-Lab').
  attr('transform', 'rotate(-90)').
  text('Time in minutes').
  attr('x', -h / 2 - 50).
  attr('y', 30);

  svg.append('text').
  attr('class', 'x-axis-Lab').
  text('Year').
  attr('x', w / 2).
  attr('y', h - 20);

  const tooltip = d3.select('#container').
  append('div').
  attr('id', 'tooltip').
  style('opacity', 0);

  svg.selectAll('circle').
  data(listParti).
  enter().
  append('circle').
  attr('class', 'dot').
  attr('cx', function (d, i) {
    return xScale(yearsSet[i]);
  }).
  attr('cy', function (d, i) {
    return yScale(timerSet[i]);
  }).
  attr('r', 4).
  attr('fill', function (d, i) {
    if (d.Doping === '') {
      return '#DAA520';
    } else {
      return '#FF6347';
    }
  }).
  attr('data-xvalue', function (d, i) {
    return yearsSet[i];
  }).
  attr('data-yvalue', function (d, i) {
    return timerSet[i];
  }).
  on('mouseover', function (d, e) {
    tooltip.transition().
    duration(300).
    style('opacity', 0.9);

    tooltip.attr('data-year', d.Year).
    style('top', 100 + 'px').
    style('right', 0 + 'px');

    tooltip.html(
    d.Name + ' : ' +
    d.Nationality +
    '<br/>' + d.Year +
    ', ' + d.Time + (
    d.Doping != '' ? '<br/>' + d.Doping : ''));

  }).
  on('mouseout', function () {
    tooltip.transition().
    duration(200).
    style('opacity', 0);
  });

  const legend = d3.select('#container').
  append('div').
  attr('id', 'legend');

  legend.append('div').
  text('Racer with doping allegation').
  append('div').
  attr('class', 'cir-label red-margin');


  legend.append('div').
  text('Racer without doping allegation').
  append('div').
  attr('class', 'cir-label gold-margin');
};