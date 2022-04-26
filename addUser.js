import UserModel from "./models/user";
// Add Customer
const addUser = (user) => {
    UserModel.create(user).then(user => {
        console.info('New User Added');
        db.close();
    })
}
export default addUser