//
//  VoiceRecognition.h
//  VoiceRecognition
//
//  Created by 유승헌 on 02/10/2019.
//  Copyright © 2019 유승헌. All rights reserved.
//

//! Project version number for VoiceRecognition.
FOUNDATION_EXPORT double VoiceRecognitionVersionNumber;

//! Project version string for VoiceRecognition.
FOUNDATION_EXPORT const unsigned char VoiceRecognitionVersionString[];

#import "ExtensionAPI.h"
#import <AddressBook/AddressBook.h>
#import <MessageUI/MessageUI.h>
#import <CoreLocation/CoreLocation.h>
#import <SystemConfiguration/SystemConfiguration.h>
#import <CoreBluetooth/CoreBluetooth.h>

@interface VoiceRecognition : ExtensionAPI {
    NSString* cid;
}

@end
