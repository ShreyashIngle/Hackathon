import React, { useEffect, useState } from 'react';
import { viewTeachers } from '../../AxiosTest/userRoutes';
import { v4 as uuidv4 } from 'uuid';
import Card from '../../Card/Card';
import TeacherListItem from '../TeacherListItem/TeacherListItem';
// import { Link } from '@reach/router';
// import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
const SearchTeachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await viewTeachers();
        setTeachers(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <div className="teacherr-list-wrapper">
      <Card>
        <ul>
          {teachers.map(teacher => (
            <li key={uuidv4()}>
              <TeacherListItem teacher={teacher} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default SearchTeachers;
