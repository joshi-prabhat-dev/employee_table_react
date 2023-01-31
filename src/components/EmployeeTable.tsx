import React, { useEffect, useState, useRef } from 'react';

import '../stylesheets/EmployeeTable.scss';


export interface IEmployee {
    name: string;
    username: string;
    email: string;
    role: string;
    status: string;
    teams: string[];
    selected?: boolean;
}

export interface AFilters {
    status: string;
    role: string;
}


function List() {
    const [origList, setOrigList] = useState<Record<string, string | string[] | boolean>[]>([]);
    const [list, setList] = useState<Record<string, string | string[] | boolean>[]>([]);

    const [appliedFilters, setAppliedFilters] = useState<AFilters>({ status: '', role: '' });

    const [sortSelect, setSortSelect] = useState<string>('name');
    const [allChecked, setAllChecked] = useState(false)

    useEffect(() => {
        fetch('https://mocki.io/v1/67d12549-e5be-4679-ba32-1229a58c692a')
            .then(res => res.json())
            .then(data => {
                setList(data.map((i: IEmployee) => ({ ...i, selected: false })))
                setOrigList(data.map((i: IEmployee) => ({ ...i, selected: false })));
            })
            .catch(error => {
                alert('Error while Fetching.');
            });
    }, []);

    useEffect(() => {
        const allCheck = list.find(i => i.selected === false)
        setAllChecked(allCheck === undefined)
    }, [list]);

    useEffect(() => {
        const filteredList = appliedFilters.status === '' ? origList : origList.filter((li) => (li.status === appliedFilters.status));
        const filteredAgain = appliedFilters.role === '' ? filteredList : filteredList.filter((li) => (li.role === appliedFilters.role));
        setList(filteredAgain);
    }, [appliedFilters, origList]);

    const applySort = (desc = false): void => {
        const sortedList = list.sort((a, b) => {
            if (desc === false) {
                return a[`${sortSelect}`] >= b[`${sortSelect}`] ? 0 : -1;
            } else {
                return a[`${sortSelect}`] <= b[`${sortSelect}`] ? 0 : -1;
            }
        });
        setList(JSON.parse(JSON.stringify(sortedList)));
    };

    const applyFilter = (filterName: string, filterValue: string) => {
        setAppliedFilters((currentFilters) => {
            if (filterName === 'role') {
                return { ...currentFilters, role: filterValue };
            } else {
                return { ...currentFilters, status: filterValue };
            }
        });
        const filteredList = filterValue ? list.filter((listItem) => {
            if (listItem[filterName] === filterValue) return true;
            return false;
        }) : origList;
        setList(filteredList);
    };

    const handleSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllChecked(prev => !prev)
        if (e.target.checked) {
            setList(prev => prev.map(val => ({ ...val, selected: true })))
        } else {
            setList(prev => prev.map(val => ({ ...val, selected: false })))
        }
    }

    const addToSelected = (id: string) => {
        const temp = list.map(val => {
            if (val.name === id) {
                return ({ ...val, selected: !val.selected })
            }
            return val;
        })
        setList(temp);
    }

    return (
        <div className='container'>
            <div className='controls-container'>
                <div className='control-entity sort-container'>
                    <select value={sortSelect} onChange={(e) => setSortSelect(e.target.value)}>
                        <option value='name'>Name</option>
                        <option value='role'>Role</option>
                    </select>
                    <button className='control-btn sort-btn' onClick={() => applySort()}>&uarr; Asc</button>
                    <button className='control-btn sort-btn' onClick={() => applySort(true)}>&darr; Desc</button>
                </div>
                <div className='control-entity filter-container'>
                    <label htmlFor='status'>Status</label>
                    <select onChange={(e) => applyFilter(e.target.name, e.target.value)} id='status' name='status' >
                        <option value=''>All</option>
                        <option value='working'>Working</option>
                        <option value='not_working'>Not Working</option>
                    </select>
                    <label htmlFor='role'>Role</label>
                    <select onChange={(e) => applyFilter(e.target.name, e.target.value)} id='role' name='role'>
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
                            <input type='checkbox' checked={allChecked} onChange={handleSelection} className='tr-check' />
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
                                        <input type='checkbox' checked={!!emp.selected} onChange={(e) => addToSelected(emp.name.toString())} className='tr-check' />
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
                                            Array.isArray(emp.teams) && emp.teams.map((team, idx1) => {
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
                                            Array.isArray(emp.teams) && emp.teams?.length > 3 && (
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