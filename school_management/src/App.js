import React, {Component} from 'react';
import {Button, Input, Table, Icon} from 'semantic-ui-react';
import axios from 'axios';


class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loginSuccessful: false,
            access_token: '',
            users: [],
            newUserName: '',
            role_id: '',
            name: '',
            newPassWord: ''
        };
    }

    deleteUser(user_id) {
        var self = this;

        axios.post('http://127.0.0.1:5000/delete_user',{
            user_id:user_id
        }, {
            headers: {'Authorization': 'JWT ' + this.state.access_token}
        }).then(function (response) {

            if (response.status == 200) {
                console.log(response);
                alert('User Deleted Successfully')

            }

        }).catch((error) => {
            alert('Something went wrong');
        })
    }

    addNewUser() {
        var self = this;
        axios.post('http://127.0.0.1:5000/add_user', {
                name: this.state.name,
                role_id: this.state.role_id,
                username: this.state.newUserName,
                password: this.state.newPassWord
            },
            {
                headers: {'Authorization': 'JWT ' + this.state.access_token},
            })
            .then(function (response) {

                if (response.status == 200) {
                    console.log(response);
                    alert('User Added Sucessfully');

                }

            })
            .catch(function (error) {
                alert('Something went wrong');
            });

    }

    getUsers() {
        var self = this;
        axios.get('http://127.0.0.1:5000/get_users', {
            headers: {'Authorization': 'JWT ' + this.state.access_token}
        })
            .then(function (response) {

                if (response.status == 200) {
                    console.log(response);

                    self.setState({
                        users: response.data.users
                    });

                }

            })
            .catch(function (error) {
                if (error.status == 401) {
                    alert('Unauthorized');
                }
                else {
                    alert('Something went wrong');
                }

            });

    }

    loginUser() {

        var self = this;
        let username = self.state.username;
        let password = self.state.password;

        axios.post('http://127.0.0.1:5000/auth', {
            username: username,
            password: password
        }) //
            .then(function (response) {

                if (response.status == 200) {
                    console.log(response);

                    self.setState({
                        access_token: response.data.access_token,
                        loginSuccessful: true
                    })

                    self.getUsers()


                }
                else {
                    alert('User Not Authorized');
                }

            })
            .catch(function (error) {
                alert('Something went wrong');
            });

    }

    onChangeInput(name, evt) {
        console.log(evt);
        this.setState({
            [name]: evt.target.value
        })
    }


    render() {
        return (
            <div>
                {
                    !this.state.loginSuccessful &&
                    <div id={'login'}>
                        <h1>LOGIN PAGE</h1>
                        <Input onChange={this.onChangeInput.bind(this, 'username')}/><br/>
                        <Input type={"password"} onChange={this.onChangeInput.bind(this, 'password')}/><br/>
                        <Button positive onClick={this.loginUser.bind(this)}>Login</Button>
                    </div>


                }
                {
                    this.state.loginSuccessful &&
                    <div id={'user_dashboard'}>
                        <h1>User Dashboard</h1>
                        <Table celled striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='3'>Name</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='3'>Role Id</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='3'></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    this.state.users.map((user) => {
                                        return <Table.Row key={user.id}>
                                            <Table.Cell colSpan='3'
                                                        collapsing>{user.name}</Table.Cell><Table.Cell
                                            colSpan='3'>{user.role_id}</Table.Cell>
                                            <Table.Cell
                                                colSpan='3'><Icon onClick={this.deleteUser.bind(this, user.id)}
                                                                  name={"delete"}></Icon></Table.Cell>
                                        </Table.Row>
                                    })

                                }

                            </Table.Body>
                        </Table>

                        <Input onChange={this.onChangeInput.bind(this, 'name')}/>
                        <Input onChange={this.onChangeInput.bind(this, 'role_id')}/>
                        <Input onChange={this.onChangeInput.bind(this, 'newUserName')}/>
                        <Input onChange={this.onChangeInput.bind(this, 'newPassWord')}/>

                        <Button positive onClick={this.addNewUser.bind(this)}>Add User</Button>
                    </div>


                }


            </div>
        );
    }
}

export default App;
