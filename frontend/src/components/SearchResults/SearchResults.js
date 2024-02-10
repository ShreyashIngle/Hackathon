import React, { useContext, useEffect, useState } from 'react';
import { SearchContext, TeacherListContext } from '../../globalState/index';
import { v4 as uuidv4 } from 'uuid';
import TeacherListItem from '../Home/TeacherListItem/TeacherListItem';

const SearchResults = () => {
  const { searchValue } = useContext(SearchContext);
  const { teacherList } = useContext(TeacherListContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Parse the e.target.value by response.data
    if (teacherList.length > 0) {
      const searchTeacherResults = teacherList.filter(teacher => {
        const teacherName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        return teacherName.includes(searchValue.toLowerCase());
      });
      setSearchResults(searchTeacherResults);
    }
  }, [searchValue, teacherList]);

  return (
    <div>
      <ul>
        {searchResults.map(teacher => {
          return (
            <li key={uuidv4()}>
              <TeacherListItem teacher={teacher} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;
