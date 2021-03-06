import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
// import {Link} from 'react-router-dom'; 
import MyButton from '../../utils/MyButton';

//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


//Icon stuuf
import EditIcon from '@material-ui/icons/Edit';

//Redux stuff
import {connect} from 'react-redux';
import {editUserDetails} from './../../redux/actions/userActions';


const styles = (theme)=>({
    ...theme.spreadThis,
    button: {
        float: 'right'
    }
})

class EditDetails extends Component {
    state ={
        bio: '',
        website: '',
        location: '',
        open: false
    };
    handleChange = (event)=>{
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    mapUserDetailsToState = (userData) =>{
        this.setState({
            bio: userData.credentials ?  userData.credentials.bio : '',
            location: userData.credentials ?  userData.credentials.location : '',
            website: userData.credentials ?  userData.credentials.website : '',
        });
    }
    handleOpen= ()=>{
        this.setState({ open: true})
        this.mapUserDetailsToState(this.props.userData);
    }
    handleClose = ()=>{
        this.setState({open: false});
    }
    componentDidMount(){
        const {userData} = this.props;
        this.mapUserDetailsToState(userData);
    }
    handleSubmit =()=>{
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <MyButton tip="Edit Details" onClick={this.handleOpen} btnClassName={classes.button}>
                            <EditIcon color='primary' />
                </MyButton>
                <Dialog 
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField name='bio' 
                                    type='text' 
                                    label='Bio' 
                                    multiline rows='3' 
                                    placeholder="A short bio about yourself"
                                    className={classes.textField}
                                    value={this.state.bio}
                                    onChange={this.handleChange}
                                    fullWidth
                            />
                            <TextField name='website' 
                                    type='text' 
                                    label='website'  
                                    placeholder="Your personal / professional website"
                                    className={classes.textField}
                                    value={this.state.website}
                                    onChange={this.handleChange}
                                    fullWidth
                            />
                            <TextField name='location' 
                                    type='text' 
                                    label='Location'  
                                    placeholder="Where you live"
                                    className={classes.textField}
                                    value={this.state.location}
                                    onChange={this.handleChange}
                                    fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color='primary'>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state)=>({
    userData: state.user.userData
})


export default connect(mapStateToProps,{editUserDetails})(withStyles(styles)(EditDetails));
