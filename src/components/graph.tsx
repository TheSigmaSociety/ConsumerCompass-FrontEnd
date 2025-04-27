import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Point {
    x: number;
    y: number;
}

interface GraphProps {
    data: Point[];
}

const Graph: React.FC<GraphProps> = ({ data }) => {
   
    return (
       
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis className="text-white" dataKey="timestamp" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
                    <YAxis className="text-white" label={{ value: "Holistic Score", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="holisticRating" stroke="#ff0000" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        
    );
};

export default Graph;