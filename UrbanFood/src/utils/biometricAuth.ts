import * as LocalAuthentication from 'expo-local-authentication';

export const authenticateUser = async (): Promise<boolean> => {
  try {
    // 1. Check hardware support
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      console.log(" Device doesn't support biometric authentication");
      return false;
    }

    // 2. Check if biometrics enrolled
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      console.log(' No biometrics enrolled');
      return false;
    }

    // 3. Authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock with Fingerprint / Face ID',
      fallbackLabel: 'Use Passcode',
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      console.log(' Biometric authentication successful');
      return true;
    } else {
      console.log(' Biometric authentication failed');
      return false;
    }
  } catch (error) {
    console.error(' Biometric authentication error:', error);
    return false;
  }
};

export const checkBiometricSupport = async (): Promise<{
  isSupported: boolean;
  isEnrolled: boolean;
  biometricType: string;
}> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType = 'None';
    if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
      )
    ) {
      biometricType = 'Face ID';
    } else if (
      supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT,
      )
    ) {
      biometricType = 'Fingerprint';
    } else if (
      supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
    ) {
      biometricType = 'Iris';
    }

    return {
      isSupported: compatible,
      isEnrolled: enrolled,
      biometricType,
    };
  } catch (error) {
    console.error(' Error checking biometric support:', error);
    return {
      isSupported: false,
      isEnrolled: false,
      biometricType: 'None',
    };
  }
};
