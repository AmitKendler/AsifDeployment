angular.module("AsifHayir").controller("findv", function ($scope) {

    var ctx = document.getElementById('f').getContext('2d');
    var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['ירקות', 'פירות', 'מבושל', 'גבינות', 'מזון יבש', 'בשר'],
            datasets: [{
                    label: "תרומה 1 שלמה נתניה",
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    data: [13, 10, 4, 2, 1, 12]
            },
                {
                    label: "תרומה 2 שלמה נתניה",
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    data: [5, 2, 0, 13, 4, 12]
            },
                {
                    label: "תרומה 1 משה חיפה",
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    data: [12, 12, 2, 0, 12, 5]
            }]
        },
        options: {title: {
                display: true,
                text: 'הרכב התרומה לפי סוג מזון'
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontSize: 24,
                    bodyFontSize: 22,
                    titleFontSize: 22,
                    fontColor: 'white'
                }
            }
        }
    });

});
