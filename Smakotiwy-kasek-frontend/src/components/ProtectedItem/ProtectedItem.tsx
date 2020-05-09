import { UserDetails } from "../../utils/models/UserDetails";
import { isAuthenticated } from "../../utils/Utils";
import { Role } from "../../utils/models/Role";

interface Props {
  userDetails?: UserDetails;
  requiredRoles?: Role[];
  element: JSX.Element;
}

export const ProtectedItem = (props: Props) => {
  return isAuthenticated(props.userDetails, props.requiredRoles) ? props.element : null;
};
