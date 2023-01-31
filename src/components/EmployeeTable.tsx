import React, { useEffect, useState, useRef } from 'react';

import '../stylesheets/EmployeeTable.scss';


export interface IEmployee {
    name: string;
    username: string;
    email: string;
    role: string;
    status: string;
    teams: string[];
}


function List() {
    const [origList, setOrigList] = useState<Record<string, string | string[]>[]>([]);
    const [list, setList] = useState<Record<string, string | string[]>[]>([]);

    const sortColRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        fetch('https://mocki.io/v1/67d12549-e5be-4679-ba32-1229a58c692a')
            .then(res => res.json())
            .then(data => {
                setList(data);
                setOrigList(data);
            })
            .catch(error => {
                alert('Error while Fetching.');
            });
    }, []);

    const applySort = (desc = false): void => {
        const sortedList = origList.sort((a, b) => {
            if (sortColRef.current){
                if (desc === false) {
                    return a[`${sortColRef.current}`] >= b[`${sortColRef.current}`] ? 0 : -1;
                } else {
                    return a[`${sortColRef.current}`] <= b[`${sortColRef.current}`] ? 0 : -1;
                }
            }
               return 1;
        });
        setList(JSON.parse(JSON.stringify(sortedList)));
    };

    const applyFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filteredList = e.target.value ? origList.filter((listItem) => {
            if (listItem[`${e.target.name}`] === e.target.value) return true;
            return false;
        }) : origList;
        setList(filteredList);
    };

    return (
        <div className='container'>
            <div className='controls-container'>
                <div className='control-entity sort-container'>
                    <select ref={sortColRef}>
                        <option value='name'>Name</option>
                        <option value='role'>Role</option>
                    </select>
                    <button className='control-btn sort-btn' onClick={() => applySort()}>&uarr; Asc</button>
                    <button className='control-btn sort-btn' onClick={() => applySort(true)}>&darr; Desc</button>
                </div>
                <div className='control-entity filter-container'>
                    <label htmlFor='status'>Status</label>
                    <select onChange={applyFilter} id='status' name='status' >
                        <option value=''>All</option>
                        <option value='working'>Working</option>
                        <option value='not_working'>Not Working</option>
                    </select>
                    <label htmlFor='role'>Role</label>
                    <select onChange={applyFilter} id='role' name='role'>
                        <option value=''>All</option>
                        <option value='Developer'>Developer</option>
                        <option value='Product Manager'>Product Manager</option>
                        <option value='Tech Manager'>Tech Manager</option>
                        <option value='Team Lead'>Team Lead</option>
                    </select>
                </div>
            </div>

            <table className='table'>
                <thead className='thead'>
                    <tr className='tr hrow'>
                        <th>
                            <input type='checkbox' className='tr-check' />
                        </th>
                        <th className='cell hcell w2'>Name</th>
                        <th className='cell hcell w3'>Status</th>
                        <th className='cell hcell w2'>Role</th>
                        <th className='cell hcell w2'>Email</th>
                        <th className='cell hcell w1'>Teams</th>
                    </tr>
                </thead>

                <tbody className='tbody'>
                    {
                        list.map((emp, index) => {
                            return (
                                <tr className='tr brow' key={index}>
                                    <td>
                                        <input type='checkbox' className='tr-check' />
                                    </td>
                                    <td className={`cell bcell name-cell w2`}>
                                        <div>{emp.name}</div>
                                        <div className='username'>@{emp.username}</div>
                                    </td>
                                    <td
                                        className={`cell bcell w3`}
                                    >
                                        <div className={`badge ${emp.status === "working" ? 'blue0' : 'red'}`}>
                                            {emp.status === 'working' ? 'Working' : 'Not Working'}
                                        </div>
                                    </td>
                                    <td className={`cell bcell w2`}>
                                        {emp.role}
                                    </td>
                                    <td className={`cell bcell w2`}>
                                        {emp.email}
                                    </td>
                                    <td className={`cell bcell teams-cell w1`}>
                                        {
                                            typeof emp.teams !== 'string' && emp.teams.map((team, idx1) => {
                                                if (idx1 < 3) {
                                                    return (
                                                        <div
                                                            className={`badge blue${idx1}`}
                                                        >
                                                            {team}
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })

                                        }
                                        {
                                            emp.teams.length > 3 && (
                                                <div className='badge'>
                                                    +{emp.teams.length - 3}
                                                </div>
                                            )
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div >
    );
}


export default List;