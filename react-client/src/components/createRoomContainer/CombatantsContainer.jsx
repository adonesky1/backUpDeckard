import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import OtherProfileContainer from '../profileAndStats/OtherProfileContainer.jsx';
import axios from 'axios';
import { connect } from 'react-redux';
import { removeUserFromNewRoom } from '../../../../redux/actions.js';

const mapStateToProps = state => {
  return {
    loggedInUser: state.username,
    usersForNewRoom: state.usersForNewRoom,
    avatarURL: state.avatarURL,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeUserFromNewRoom: (username) => dispatch(removeUserFromNewRoom(username)),
  };
};

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
  modal: {
    position: 'absolute',
    boxShadow: theme.shadows[5],
  },
});

class ConnectedCombatantsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userAvatarMap: [],

      clickedFriend: '',
    }
  }

  componentWillReceiveProps() {
    if (this.props.usersForNewRoom.slice(1)) {
      Promise.all(this.props.usersForNewRoom.slice(1).map(friend => {
        return axios.post('/api/userInfo', { user: friend });
      }))
        .then(res => {
          const avatars = res.map(data => data.data.avatar);
          const map = this.props.usersForNewRoom.slice(1).map((friend, i) => {
            return [friend, avatars[i]];
          });
          this.setState({ userAvatarMap: map });
        });
    }
  }

  handleClick() {
    this.setState({
      addFriend: true,
    });
  }

  handleOpen(friend) {
    console.log(friend);
    this.setState({
      clickedFriend: friend
    }, () => {
      this.setState({
        open: true,
      });
    });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;

    return ([
      <div>
        <Typography id="users-for-new-room-header">
          Users &ensp;<span style={{ flex: "right" }}>{this.props.usersForNewRoom.length}/7</span>
        </Typography>

        {/* logged in user's chip */}
        <Chip
          style={{ zIndex: '0' }}
          avatar={
            <Avatar>
              <img src={this.props.avatarURL}
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%',
                  height: '32px',
                  width: '32px',
                }} />
            </Avatar>
          }
          label={this.props.loggedInUser}
          className={classes.chip}
        />

        {/* invited users' chips */}
        {this.state.userAvatarMap.map(userAvatar => {
          console.log('USERAVATAR', userAvatar)
          if (userAvatar[1] &&
            userAvatar[1] !== './assets/roboheadwhite.png') {
            return (
              <Chip
                style={{ zIndex: '0' }}
                avatar={
                  <Avatar>
                    <img src={userAvatar[1]}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '50%',
                        height: '32px',
                        width: '32px',
                      }} />
                  </Avatar>
                }
                label={userAvatar[0]}
                className={classes.chip}
              />
            )
          } else {
            return (
              <Chip
                style={{ zIndex: '0' }}
                label={userAvatar[0]}
                className={classes.chip}
              />
            )
          }
        })}


      </div>,
      <Modal
        style={{ alignItems: 'center', justifyContent: 'center' }}
        open={this.state.open}
        onClose={this.handleClose.bind(this)}
      >
        <div style={{
          top: '20%',
          margin: 'auto',
          width: '700px',
          backgroundColor: 'black',
        }}
          className={classes.modal}>
          <OtherProfileContainer friend={this.state.clickedFriend} />
        </div>
      </Modal>
    ]);
  }

}

ConnectedCombatantsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const CombatantsContainer = withStyles(styles)(ConnectedCombatantsContainer);

export default connect(mapStateToProps, mapDispatchToProps)(CombatantsContainer);