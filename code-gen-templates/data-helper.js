const data = {
  templateData: [
    {
      name: 'Carbon Risk Score',
      portfolio: 27.2,
      benchmark: 21.2,
    },
    {
      name: 'Carbon Risk Classification',
      portfolio: 'Medium Risk',
      benchmark: 'High Risk',
    },
    {
      name: 'Carbon Intensity',
      portfolio: 157.32,
      benchmark: 168.13,
    },
    {
      name: 'Percent AUM Covered (%)',
      benchmark: 80,
      portfolio: 75,
    },
    {
      name: 'Fossil Fuel Involvement',
      portfolio: 5.38,
      benchmark: 15.54,
    },
    {
      name: 'Carbon Solutions Involvement',
      portfolio: 8.38,
      benchmark: 12.54,
    },
  ],
};

const headers = [];
Object.keys(data.templateData[0]).forEach((item, index) => {
  headers.push({
    title: item || '-',
    align: index === 0 ? 'left' : 'right',
  });
});

data.headers = headers;
module.exports = data;
