/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.LoginUserVO } | undefined) {
  const {currentUser} = initialState ?? {};
  alert(currentUser);
  return {
    canUser: !(currentUser===undefined||currentUser===null),
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}
