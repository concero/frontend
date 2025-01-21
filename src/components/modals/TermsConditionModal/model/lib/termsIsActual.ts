import { IUser } from '../../../../../api/concero/user/userType'
import { TermsOfUseVersion } from '../consts/versions'

export const termsIsActual = (user?: IUser) => {
	// If he has not signed or has expired
	if (!user || !user.termsOfUse || user.termsOfUse.accepted_version !== TermsOfUseVersion.V1) {
		return false
	} else {
		return true
	}
}
