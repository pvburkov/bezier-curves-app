import './App.css';

import React, { Component } from 'react';

const CUBE = 'cube';
const QUAD = 'quad';
const CUBE_INFO = 'Введите 2 опорные и 2 управляющие точки';
const QUAD_INFO = 'Введите 2 опорные и 1 управляющую точки';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            draggingPoint: null,
            info: CUBE_INFO,
            points: [],
            splineType: CUBE,
        };

        this.getGeometry = this.getGeometry.bind(this);
        this.handleAddPoints = this.handleAddPoints.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.printPointsInfo = this.printPointsInfo.bind(this);
    }

    getGeometry() {
        const {
            points,
            splineType,
        } = this.state;

        if ((splineType === QUAD && points.length < 3)
            || (splineType === CUBE && points.length < 4)) {
            return;
        } 

        return (
            <>
                <line
                    x1={points[0].x} 
                    y1={points[0].y} 
                    x2={points[2].x} 
                    y2={points[2].y} 
                    stroke="#646464" 
                    strokeDasharray="4 2" 
                    strokeWidth="2"
                />
                <line
                    x1={points[1].x} 
                    y1={points[1].y} 
                    x2={splineType === CUBE
                        ? points[3].x
                        : points[2].x
                    } 
                    y2={splineType === CUBE
                        ? points[3].y
                        : points[2].y
                    } 
                    stroke="#646464" 
                    strokeDasharray="4 2" 
                    strokeWidth="2"
                /> 
                <path
                    d={splineType === CUBE 
                        ? `
                            M${points[0].x},${points[0].y} 
                            C${points[2].x},${points[2].y} 
                            ${points[3].x},${points[3].y} 
                            ${points[1].x},${points[1].y}
                        `
                        : `
                            M${points[0].x},${points[0].y} 
                            Q${points[2].x},${points[2].y} 
                            ${points[1].x},${points[1].y}
                        `
                    }
                    fill="none"
                    stroke="blue"
                    strokeWidth="4"
                />
            </>
        );
    }

    handleAddPoints(evt) {
        evt.preventDefault();

        if ((this.state.splineType === QUAD && this.state.points.length === 3)
            || (this.state.splineType === CUBE && this.state.points.length === 4)) {
            return;
        }

        const CTM = evt.target.getScreenCTM();

        const newPoints = this.state.points;
        newPoints.push({
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d,
        });

        this.setState({
            points: newPoints,
        });
    }

    handleChange(evt) {
        this.setState({
            info: (evt.target.value === CUBE)
                ? CUBE_INFO
                : QUAD_INFO,
            points: [],
            splineType: evt.target.value,
        });
    }

    handleDrag(evt) {
        evt.preventDefault();

        if (this.state.draggingPoint === null) {
            return;
        }

        const CTM = evt.target.getScreenCTM();
        const updatedPoints = this.state.points.slice();

        updatedPoints[this.state.draggingPoint] = {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d,
        };

        this.setState({
            points: updatedPoints,
        });
    }

    handleDragEnd(evt, index) {
        evt.preventDefault();

        if (this.state.draggingPoint !== index) {
            return;
        }

        this.setState({
            draggingPoint: null,
        });
    }

    handleDragStart(evt, index) {
        evt.preventDefault();

        if (this.state.draggingPoint !== null && this.state.draggingPoint !== index) {
            return;
        }

        this.setState({
            draggingPoint: index,
        });
    }

    printPointsInfo() {
        const {
            points,
            splineType,
        } = this.state;

        switch(splineType) {
            case CUBE: 
                return [
                    points[0] ? `P1: [${points[0].x.toFixed()}, ${points[0].y.toFixed()}]` : 'P1:',
                    points[1] ? `P2: [${points[1].x.toFixed()}, ${points[1].y.toFixed()}]` : 'P2:',
                    points[2] ? `Pc1: [${points[2].x.toFixed()}, ${points[2].y.toFixed()}]` : 'Pc1:',
                    points[3] ? `Pc2: [${points[3].x.toFixed()}, ${points[3].y.toFixed()}]` : 'Pc2:',
                ];

            case QUAD:
                return [
                    points[0] ? `P1: [${points[0].x.toFixed()}, ${points[0].y.toFixed()}]` : 'P1:',
                    points[1] ? `P2: [${points[1].x.toFixed()}, ${points[1].y.toFixed()}]` : 'P2:',
                    points[2] ? `Pc1: [${points[2].x.toFixed()}, ${points[2].y.toFixed()}]` : 'Pc1:',
                ];
        }
    }

    render() {
        return (
            <div className="app-container">
                <header>
                    Bezier-splines maker
                </header>
                <div className="canvas-container">
                    <svg
                        height="450"
                        id="canvas-0"
                        onMouseDown={this.handleAddPoints}
                        onMouseMove={this.handleDrag}
                        viewBox="0 0 800 450"
                        width="800"
                    >
                        {this.getGeometry()}
                        {this.state.points.map((point, index) => (
                            <circle
                                cx={point.x}
                                cy={point.y}
                                fill="#f8da31"
                                key={index}
                                onMouseDown={(evt) => this.handleDragStart(evt, index)}
                                onMouseUp={(evt) => this.handleDragEnd(evt, index)}
                                r="10"
                                stroke="blue"
                                strokeWidth="1px"
                            />
                        ))}
                    </svg>
                </div>
                <div className="controls">
                    <div
                        className="spline-type-label"
                    >
                        Выберите тип кривой Безье:
                    </div>
                    <select
                        className="spline-type-picker"
                        id="spline-type-picker"
                        onChange={this.handleChange}
                    >
                        <option
                            className="option"
                            value={CUBE}
                        >
                            Кубическая кривая
                        </option>
                        <option
                            className="option"
                            value={QUAD}
                        >
                            Квадратичная кривая
                        </option>    
                    </select>
                    <button
                        className="btn"
                        onClick={() => this.setState({
                            points: [],
                        })}
                    >
                        Удалить геометрию
                    </button>
                    <div className="info">
                        {this.state.info}
                        <br />
                        {this.printPointsInfo().map((str, index) => (
                            <div key={index}>
                                {str}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
