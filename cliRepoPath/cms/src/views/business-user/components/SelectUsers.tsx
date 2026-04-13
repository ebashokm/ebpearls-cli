import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, TextField, CircularProgress } from '@mui/material';
import { useGQL } from '../hooks/useGQL';
import { useFormikContext } from 'formik';

interface User {
  _id: string;
  authProviderId: string;
  firstName: string | null;
  lastName: string | null;
}

interface Pagination {
  total: number;
  hasNextPage: boolean;
}

interface GetAllAppUsersResponse {
  message: string;
  users: User[];
  pagination: Pagination;
}

interface SelectUsersProps {
  setFieldValue: (field: string, value: string) => void;
  values: string;
  name: string;
  disabled?: boolean;
}

export default function SelectUsers({ setFieldValue, values, name, disabled }: SelectUsersProps) {
  const { GET_USERS } = useGQL();
  const [users, setUsers] = useState<User[]>([]); // Store fetched users
  const [search, setSearch] = useState<string>('');
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const limit = 10; // Number of users to fetch in each batch

  const { loading, error, data, fetchMore } = GET_USERS(100, search);

  // Update users when data is fetched
  useEffect(() => {
    if (data && data.getAllAppUsers) {
      setUsers((prevUsers) => [...prevUsers, ...data?.getAllAppUsers?.users!]);
    }
  }, [data]);

  // Function to find the user by ID for setting the initial value
  const findUserById = (id: string): User | undefined | any => users.find((user) => user._id === id);

  // Function to fetch more users
  const loadMoreUsers = () => {
    if (!isFetchingMore && data?.getAllAppUsers?.pagination?.hasNextPage) {
      setIsFetchingMore(true);
      fetchMore({
        variables: {
          input: { limit, skip: users.length, searchText: search },
        },
        //@ts-ignore
        updateQuery: (prevResult, { fetchMoreResult }) => {
          setIsFetchingMore(false);
          if (!fetchMoreResult) return prevResult;

          // Append new users to the existing list
          return {
            ...prevResult,
            getAllAppUsers: {
              ...prevResult.getAllAppUsers,
              users: [...prevResult?.getAllAppUsers?.users!, ...fetchMoreResult?.getAllAppUsers?.users!],
              pagination: fetchMoreResult?.getAllAppUsers?.pagination!,
            },
          };
        },
      });
    }
  };

  // Handle scroll event for infinite scrolling
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10 // When near the bottom
    ) {
      loadMoreUsers();
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="user"
      // Find the selected user using the _id stored in values
      value={findUserById(values) || null} // Set value based on user's _id
      options={users || []} // Ensure users is always an array
      getOptionLabel={(option) =>
        option.firstName === null && option.lastName === null
          ? option.authProviderId
          : `${option.firstName} ${option.lastName}`
      }
      onChange={(event, newValue) => {
        // Set the selected user's _id into Formik's form state
        setFieldValue(name, newValue ? newValue._id : '');
      }}
      onScroll={handleScroll} // Attach the scroll event handler for infinite scrolling
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.firstName === null && option.lastName === null
            ? option.authProviderId
            : `${option.firstName} ${option.lastName}`}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          value={values} // Keeps the Formik value in sync
          onChange={(e) => setSearch(e.target.value)} // Update search term
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off', // disable autocomplete and autofill
          }}
        />
      )}
      loading={loading || isFetchingMore} // Show loading indicator during fetch
      ListboxProps={{
        onScroll: handleScroll, // Infinite scroll in the dropdown list
      }}
      // Optional loading indicator
      loadingText={<CircularProgress size={24} />}
      disabled={disabled}
    />
  );
}
