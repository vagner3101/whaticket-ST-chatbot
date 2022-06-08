import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
//import {
//    BarChart,
//    CartesianGrid,
//    Bar,
//    XAxis,
//    YAxis,
//    Label,
//    ResponsiveContainer,
//} from "recharts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { i18n } from "../../translate/i18n";

import Title from "./Title";

const ChartPerUser = ({ tickets, users = null }) => {
    const theme = useTheme();

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        let arr = [{ name: 'Chatbot', qt: 0 }];
        users.forEach(user => {
            arr.push({ name: user.name, qt: 0 });
        });

        setChartData(arr);

        setChartData(prevState => {
            let aux = [...prevState];
            aux.forEach(a => {
                tickets.forEach(ticket => {
                    if (ticket.user) {
                        ticket.user.name === a.name &&
                            a.qt++;
                    } else {
                        a.name === 'Chatbot' && a.qt++;
                    }
                });
            });

            return aux;
        });
    }, [tickets]);

    return (
        <React.Fragment>
            {/*<Title>{`${i18n.t("dashboard.charts.perUser.title")}${tickets.length
                }`}</Title>*/}
            <ResponsiveContainer>
                <AreaChart
                    data={chartData}

                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} angle={45} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="qt" stroke="#28A745" fill="#28A745" />
                </AreaChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default ChartPerUser;
