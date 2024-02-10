import React, { useEffect, useState } from 'react';
import ParentListItem from '../ParentListItem/ParentListItem';
import Card from '../../../Card/Card';
import './ParentList.scss';
import { viewClients } from '../../../AxiosTest/userRoutes';
import { v4 as uuidv4 } from 'uuid';

const ParentList = () => {
  const [parents, setParents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewClients();
        setParents(response.data);
      } catch (err) {
        console.log(err);
        setParents(['Something went wrong, bad request']);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="Parent-list-wrapper">
      <Card>
        <ul>
          {parents.map(user => (
            <li key={uuidv4()}>
              <ParentListItem
                name={`${user.firstName} ${user.lastName}`}
                id={user._id}
                state={user}
                image={''}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ParentList;
