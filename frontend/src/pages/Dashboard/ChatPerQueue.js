import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer,Tooltip } from 'recharts';

import { i18n } from "../../translate/i18n";

import Title from "./Title";

const ChartPerQueue = ({ tickets, queues }) => {
    const theme = useTheme();

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        let arr = [];
        queues.forEach(queue => {
            arr.push({ name: queue.name, qt: 0 });
        });

        setChartData(arr);

        setChartData(prevState => {
            let aux = [...prevState];
            aux.forEach(a => {
                tickets.forEach(ticket => {
                    if (ticket.queue) {
                        ticket.queue.name === a.name &&
                            a.qt++;
                    }
                });
            });

            return aux;
        });
    }, [tickets]);

    return (
        <React.Fragment>
            {/*<Title>{`${i18n.t("dashboard.charts.perQueue.title")}${tickets.length
                }`}</Title>*/}
            <ResponsiveContainer>
                <PieChart width="100">
                    <Pie data={chartData} dataKey="qt" cx="50%" cy="50%" outerRadius={60} fill="#FD7E14" label />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default ChartPerQueue;
