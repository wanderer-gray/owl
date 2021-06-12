import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    width: '100%',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  searchIcon: {
    position: 'absolute',
    height: '100%',
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchView = ({ SearchStore }) => {
  const classes = useStyles();

  const {
    view,
    placeholder,
    value,
    onChange,
  } = SearchStore || {};

  if (!view) {
    return null;
  } 

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>

      <InputBase
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchView;
