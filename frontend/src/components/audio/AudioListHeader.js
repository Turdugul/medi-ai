import React, { memo } from 'react';
import { FaSearch, FaUserAlt } from 'react-icons/fa';
import SearchInput from '../common/SearchInput';

const AudioListHeader = memo(({ 
  searchId, 
  onSearchChange, 
  onSearchClear, 
  totalRecords 
}) => (
  <>
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
        Audio Record List
      </h1>
      <p className="text-gray-600">
        Manage and view all your audio records
      </p>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <SearchInput
        icon={FaSearch}
        value={searchId}
        onChange={onSearchChange}
        placeholder="Search by Record ID"
        onClear={onSearchClear}
      />
      <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <FaUserAlt className="text-blue-500" />
          <span className="text-gray-700">
            Total Records: <span className="font-semibold text-blue-600">
              {totalRecords}
            </span>
          </span>
        </div>
      </div>
    </div>
  </>
));

AudioListHeader.displayName = 'AudioListHeader';

export default AudioListHeader; 