import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
import { Card, CardContent } from '@material-ui/core';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                parse: "MM/DD/YY",
                tooltipFormat: "ll",
            },
        },],
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                callback: function(value, index, values) {
                    return numeral(value).format("0a");
                },
            },
        },],
    },
};

const getChartData = (data) => {
    let chartData = [];
    let lastPoint;

    for(let date in data){
        if(lastPoint){
            let newPoint = {
                x: date,
                y: data[date] - lastPoint
            }
            chartData.push(newPoint);
        }
        lastPoint = data[date];
    }
    return chartData;
};

function LineGraph({caseType, country}) {
    const [data, setData] = useState({});
    const [borderColor, setBorderColor] = useState("");
    const [bgColor, setBgColor] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=25`)
                .then((response) => response.json())
                .then((data) => {
                    
                let chartData = country !== "All" ? data.timeline : data;

                console.log(data);
                if(caseType == "active") 
                {
                    setData(getChartData(chartData.cases));
                    setBgColor("#003ce1");
                }
                
                if(caseType === "recovered") 
                {
                    setData(getChartData(chartData.recovered));
                    setBgColor("#30b400");
                }
                
                if(caseType === "deaths") 
                {
                    setData(getChartData(chartData.deaths));
                    setBgColor("#e1003c");
                }
            });
             
        };
        fetchData();
               
    }, [caseType, country]);

    return (
        
        <div>
            {data?.length > 0 && (
                <Card>
                    <CardContent>
                <Line
                height={350}
                width={800}
                options={options}
                data={{
                    datasets: [{
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        data: data,
                        label: caseType,
                    }],
                }}                
            />
            </CardContent>
            </Card>
            )}
            
        </div>
    )
}

export default LineGraph;
