import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './../EditDetails/index';
import MyButton from '../../utils/MyButton';

//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

//Redux stuff
import {connect} from 'react-redux';
import {uploadImage, logoutUser} from './../../redux/actions/userActions';



const styles = (theme) =>({
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});

class Profile extends Component {
    handleImageChange = (event)=>{
        const image =  event.target.files[0];
        //send to server
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }
    handleEditPicture =()=>{
        const fileInput = document.getElementById('imageUpload');
        fileInput.click();
    }
    handleLogout =()=>{
        this.props.logoutUser()
    }
    render() {
        const {classes, 
                user:{
                    userData : {credentials},
                    loading,
                    authenticated
                    }
                } = this.props;
        
        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className='image-wrapper'>
                        <img src={credentials.imageUrl} alt="profile" className='profile-image'/>
                        <input type='file' id='imageUpload' hidden='hidden' onChange={this.handleImageChange} />
                        <MyButton tip="Edit Profile Picture" onClick={this.handleEditPicture} btnClassName='button'>
                            <EditIcon color='primary' />
                        </MyButton>
                    </div>
                    <hr />
                    <div className='profile-details'>
                        <MuiLink component={Link} to={`/users/${credentials.userHandle}`} color='primary' variant='h5'>
                            @{credentials.userHandle}
                        </MuiLink>
                        <hr/>
                        {credentials.bio && <Typography variant='body2'>{credentials.bio}</Typography>}
                        <hr/>
                        {credentials.location && (
                            <Fragment>
                                <LocationOn color="primary" /> <span>{credentials.location}</span>
                                <hr/>
                            </Fragment> 
                        )}
                        {credentials.website && (
                            <Fragment>
                                <LinkIcon color='primary'/>
                                <a href={credentials.website} target='_blank' rel="noopener noreferrer">
                                    {' '}{credentials.website}
                                </a>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color='primary' />{' '}
                        <span>Joined {dayjs(credentials.createdAt).format('MMM YYYY')}</span>
                    </div>
                    <MyButton tip="Logout" onClick={this.handleLogout} >
                        <KeyboardReturn color='primary' />
                    </MyButton>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant='body2' align='center'>
                    No profile found, please login again
                </Typography>
                <div className={classes.buttons}>
                    <Button variant='contained' color='primary' component={Link} to='/login'>
                        Login
                    </Button>
                    <Button variant='contained' color='secondary' component={Link} to='/signup'>
                        Signup
                    </Button>
                </div>
            </Paper>
        )) : (<p> loading... </p>)

        return profileMarkup;
    }
}

Profile.propTypes ={
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
}; 

const mapStateToProps = (state) =>({
    user: state.user
});

const mapActionsToProps = {
    uploadImage, logoutUser
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
