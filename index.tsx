declare var Chart: any;

document.addEventListener('DOMContentLoaded', () => {
    const chartTooltipConfig = {
        callbacks: {
            title: function(tooltipItems: any[]) {
                const item = tooltipItems[0];
                if (!item) return '';
                let label = item.chart.data.labels[item.dataIndex];
                if (Array.isArray(label)) {
                  return label.join(' ');
                }
                return label;
            }
        }
    };

    // --- Exhibit A: Float Chart ---
    const floatData = {
        labels: ['Q3 23', 'Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'],
        reported: [721, 728, 536, 328, 768, 727, 787, 475],
        interest: [66, 95, 68, 66, 89, 87, 81, 86],
        get pureMarketplace() {
            return this.reported.map((val: number, i: number) => val - this.interest[i]);
        }
    };

    const floatChartEl = document.getElementById('floatChart') as HTMLCanvasElement | null;
    if (floatChartEl) {
        const floatCtx = floatChartEl.getContext('2d');
        if (floatCtx) {
            const floatChart = new Chart(floatCtx, {
                type: 'bar',
                data: {
                    labels: floatData.labels,
                    datasets: [{
                        label: 'Reported GAAP Pre-Tax Income ($M)',
                        data: floatData.reported,
                        backgroundColor: '#60a5fa', // blue-400
                        borderColor: '#2563eb', // blue-600
                        borderWidth: 1,
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: chartTooltipConfig,
                    },
                    scales: {
                        x: { 
                            stacked: false,
                            grid: { display: false } 
                        },
                        y: { 
                            stacked: false,
                            beginAtZero: true,
                            title: { display: true, text: 'Income in Millions USD' }
                        }
                    }
                }
            });

            let isFloatToggled = false;
            const toggleFloatButton = document.getElementById('toggleFloat');
            if (toggleFloatButton) {
                toggleFloatButton.addEventListener('click', () => {
                    isFloatToggled = !isFloatToggled;
                    const button = toggleFloatButton as HTMLButtonElement;
                    
                    if (isFloatToggled) {
                        floatChart.data.datasets = [
                            {
                                label: '"Pure Marketplace" Income ($M)',
                                data: floatData.pureMarketplace,
                                backgroundColor: '#60a5fa',
                            },
                            {
                                label: 'Income from "Float" ($M)',
                                data: floatData.interest,
                                backgroundColor: '#f87171', // red-400
                            }
                        ];
                        if (floatChart.options.scales && floatChart.options.scales.x) {
                            floatChart.options.scales.x.stacked = true;
                        }
                        if (floatChart.options.scales && floatChart.options.scales.y) {
                            floatChart.options.scales.y.stacked = true;
                        }
                        button.textContent = 'Show Reported Income';
                        button.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                        button.classList.add('bg-gray-600', 'hover:bg-gray-700');
                    } else {
                        floatChart.data.datasets = [{
                            label: 'Reported GAAP Pre-Tax Income ($M)',
                            data: floatData.reported,
                            backgroundColor: '#60a5fa',
                            borderColor: '#2563eb',
                            borderWidth: 1,
                        }];
                        if (floatChart.options.scales && floatChart.options.scales.x) {
                           floatChart.options.scales.x.stacked = false;
                        }
                        if (floatChart.options.scales && floatChart.options.scales.y) {
                           floatChart.options.scales.y.stacked = false;
                        }
                        button.textContent = 'Show "Pure Marketplace" Income';
                        button.classList.remove('bg-gray-600', 'hover:bg-gray-700');
                        button.classList.add('bg-blue-600', 'hover:bg-blue-700');
                    }
                    floatChart.update();
                });
            }
        }
    }


    // --- Exhibit B: Take Rate Chart ---
    const takeRateData = {
        labels: ['Q3 23', 'Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'],
        reported: [13.90, 13.78, 13.72, 13.96, 14.07, 13.35, 13.78, 13.99],
        clean: [13.42, 13.24, 13.24, 13.50, 13.59, 12.90, 13.35, 13.55]
    };

    const takeRateChartEl = document.getElementById('takeRateChart') as HTMLCanvasElement | null;
    if (takeRateChartEl) {
        const takeRateCtx = takeRateChartEl.getContext('2d');
        if(takeRateCtx){
            new Chart(takeRateCtx, {
                type: 'line',
                data: {
                    labels: takeRateData.labels,
                    datasets: [{
                        label: 'Reported Take Rate',
                        data: takeRateData.reported,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.3
                    }, {
                        label: '"Clean" Take Rate',
                        data: takeRateData.clean,
                        borderColor: '#16a34a', // green-600
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: chartTooltipConfig,
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            title: { display: true, text: 'Take Rate (%)' },
                            ticks: {
                                callback: (value: string | number) => Number(value).toFixed(2) + '%'
                            }
                        }
                    }
                }
            });
        }
    }


    // --- Nav Scroll Spy ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    window.onscroll = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 120) {
                current = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            const href = link.getAttribute('href');
            if (href && current && href.includes(current)) {
                link.classList.add('nav-active');
            }
        });
    };
});
