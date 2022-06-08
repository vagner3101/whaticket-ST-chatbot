import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	online: {
		background: 'green',
		borderRadius: '50%',
		width: '10px',
		height: '10px',
		display: 'inline-block'
	},
	offline: {
		background: 'red',
		borderRadius: '50%',
		width: '10px',
		height: '10px',
		display: 'inline-block'
	}
}));

const UserStatusIcon = ({ user }) => {
    const classes = useStyles();
    return user.status === 'online' ?
        <span>
            <span className={classes.online}></span>
        </span> :
        <span>
            <span className={classes.offline}></span>
        </span>
}

export default UserStatusIcon;