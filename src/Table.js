import React from 'react';
import './Table.css';
import NumberFormat from 'react-number-format';

function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td><strong><NumberFormat thousandSeparator value={cases} displayType={'text'}/></strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
