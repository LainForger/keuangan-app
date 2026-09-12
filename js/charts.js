/**
 * Modul Chart Visualisasi Keuangan dengan Chart.js (Async Data Support)
 */

const ChartsManager = {
    monthlyBarChart: null,
    categoryDonutChart: null,
    trendLineChart: null,

    /**
     * Inisialisasi atau pembaruan seluruh grafik secara async
     */
    async updateCharts(selectedMonth = 'all') {
        await Promise.all([
            this.renderMonthlyBarChart(),
            this.renderCategoryDonutChart(selectedMonth),
            this.renderTrendLineChart()
        ]);
    },

    /**
     * Diagram Batang: Jumlah Pengeluaran per Bulan (dan perbandingan Pemasukan)
     */
    async renderMonthlyBarChart() {
        const ctx = document.getElementById('monthlyBarChart');
        if (!ctx) return;

        const data = await StorageManager.getMonthlyExpenseData();

        if (this.monthlyBarChart) {
            this.monthlyBarChart.destroy();
        }

        this.monthlyBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Pengeluaran (Rp)',
                        data: data.expenses,
                        backgroundColor: 'rgba(239, 68, 68, 0.75)',
                        borderColor: '#ef4444',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        borderSkipped: false,
                        barThickness: 24,
                        maxBarThickness: 32
                    },
                    {
                        label: 'Pemasukan (Rp)',
                        data: data.incomes,
                        backgroundColor: 'rgba(16, 185, 129, 0.75)',
                        borderColor: '#10b981',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        borderSkipped: false,
                        barThickness: 24,
                        maxBarThickness: 32
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                            usePointStyle: true,
                            padding: 16
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatRupiah(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 11 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.06)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            callback: function (value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + ' Jt';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + ' Rb';
                                }
                                return value;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Diagram Donut: Alokasi Pengeluaran Berdasarkan Kategori
     */
    async renderCategoryDonutChart(selectedMonth = 'all') {
        const ctx = document.getElementById('categoryDonutChart');
        if (!ctx) return;

        const data = await StorageManager.getCategoryExpenseBreakdown(selectedMonth);

        if (this.categoryDonutChart) {
            this.categoryDonutChart.destroy();
        }

        const emptyContainer = document.getElementById('donutEmptyState');

        if (data.amounts.length === 0 || data.amounts.every(val => val === 0)) {
            if (emptyContainer) emptyContainer.classList.remove('hidden');
            ctx.style.display = 'none';
            return;
        } else {
            if (emptyContainer) emptyContainer.classList.add('hidden');
            ctx.style.display = 'block';
        }

        this.categoryDonutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.amounts,
                        backgroundColor: data.colors,
                        borderColor: '#0f172a',
                        borderWidth: 3,
                        hoverOffset: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
                            usePointStyle: true,
                            padding: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatRupiah(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    /**
     * Diagram Garis: Tren Finansial (Line Chart Pemasukan vs Pengeluaran)
     */
    async renderTrendLineChart() {
        const ctx = document.getElementById('trendLineChart');
        if (!ctx) return;

        const data = await StorageManager.getMonthlyExpenseData();

        if (this.trendLineChart) {
            this.trendLineChart.destroy();
        }

        const chartCtx = ctx.getContext('2d');
        const incomeGradient = chartCtx.createLinearGradient(0, 0, 0, 300);
        incomeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        incomeGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        const expenseGradient = chartCtx.createLinearGradient(0, 0, 0, 300);
        expenseGradient.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
        expenseGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        this.trendLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: data.incomes,
                        borderColor: '#10b981',
                        backgroundColor: incomeGradient,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#0f172a',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Pengeluaran',
                        data: data.expenses,
                        borderColor: '#ef4444',
                        backgroundColor: expenseGradient,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#0f172a',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                            usePointStyle: true,
                            padding: 14
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${formatRupiah(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 11 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.06)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            callback: function (value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + ' Jt';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + ' Rb';
                                }
                                return value;
                            }
                        }
                    }
                }
            }
        });
    }
};
