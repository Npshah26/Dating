"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../../config/logging"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
// const mysql = require('mysql');
// const util = require('util');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Visitors';
const getVisitors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Visitors');
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            // let newSql = `select  up.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, 
            // addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age FROM userproposals up 
            // LEFT JOIN users u ON u.id = up.proposalUserId
            // LEFT JOIN images img ON img.id = u.imageId
            // LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            // LEFT JOIN occupation o ON o.id = upd.occupationId where up.userId = ` + userId + ` AND `
            let countSql = `select COUNT(*) as totalCount from (SELECT up.id , up.proposalUserId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, u.isVerifyProfilePic, upd.memberid, 
                addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age, 
                up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe , 
                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
, IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
, IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
, (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                 FROM userproposals up 
                                 LEFT JOIN users u ON u.id = up.proposalUserId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.userId =` + userId + ` 
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)   
                                 and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
                                 union 
                                 SELECT up.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation, upd.birthDate, u.isVerifyProfilePic, upd.memberid,
                                 addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age,
                                 up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe , 
                                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
                , IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
                ,  IF((select COUNT(id) from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 1 ) > 0,true,false) as hascancelled
                , (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                 FROM userproposals up 
                                 LEFT JOIN users u ON u.id = up.userId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.proposalUserId = ` + userId + ` 
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
                                 and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))  as t1 WHERE t1.status = true`;
            console.log(countSql);
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `WITH preference_weights AS (
                      SELECT
                        MAX(CASE WHEN name = 'pAge' THEN weightage END) AS pAgeWeight,
                        MAX(CASE WHEN name = 'pHeight' THEN weightage END) AS pHeightWeight,
                        MAX(CASE WHEN name = 'pMaritalStatus' THEN weightage END) AS pMaritalStatusWeight,
                        MAX(CASE WHEN name = 'pProfileWithChildren' THEN weightage END) AS pProfileWithChildrenWeight,
                        MAX(CASE WHEN name = 'pFamilyType' THEN weightage END) AS pFamilyTypeWeight,
                        MAX(CASE WHEN name = 'pReligion' THEN weightage END) AS pReligionWeight,
                        MAX(CASE WHEN name = 'pCommunity' THEN weightage END) AS pCommunityWeight,
                        MAX(CASE WHEN name = 'pMotherTongue' THEN weightage END) AS pMotherTongueWeight,
                        MAX(CASE WHEN name = 'pHoroscopeBelief' THEN weightage END) AS pHoroscopeBeliefWeight,
                        MAX(CASE WHEN name = 'pManglikMatch' THEN weightage END) AS pManglikMatchWeight,
                        MAX(CASE WHEN name = 'pCountryLivingIn' THEN weightage END) AS pCountryLivingInWeight,
                        MAX(CASE WHEN name = 'pStateLivingIn' THEN weightage END) AS pStateLivingInWeight,
                        MAX(CASE WHEN name = 'pCityLivingIn' THEN weightage END) AS pCityLivingInWeight,
                        MAX(CASE WHEN name = 'pEducationType' THEN weightage END) AS pEducationTypeWeight,
                        MAX(CASE WHEN name = 'pEducationMedium' THEN weightage END) AS pEducationMediumWeight,
                        MAX(CASE WHEN name = 'pOccupation' THEN weightage END) AS pOccupationWeight,
                        MAX(CASE WHEN name = 'pEmploymentType' THEN weightage END) AS pEmploymentTypeWeight,
                        MAX(CASE WHEN name = 'pAnnualIncome' THEN weightage END) AS pAnnualIncomeWeight,
                        MAX(CASE WHEN name = 'pDiet' THEN weightage END) AS pDietWeight,
                        MAX(CASE WHEN name = 'pSmokingAcceptance' THEN weightage END) AS pSmokingAcceptanceWeight,
                        MAX(CASE WHEN name = 'pAlcoholAcceptance' THEN weightage END) AS pAlcoholAcceptanceWeight,
                        MAX(CASE WHEN name = 'pDisabilityAcceptance' THEN weightage END) AS pDisabilityAcceptanceWeight,
                        MAX(CASE WHEN name = 'pComplexion' THEN weightage END) AS pComplexionWeight,
                        MAX(CASE WHEN name = 'pBodyType' THEN weightage END) AS pBodyTypeWeight
                      FROM preferenceweightage
                    ),
                    disableScreen AS(
                    SELECT 
                        MAX(CASE WHEN name = 'isEnableFamilyDetails' THEN value END) AS isEnableFamilyDetails, 
                        MAX(CASE WHEN name = 'isEnableAstrologicDetails' THEN value END) AS isEnableAstrologicDetails,
                        MAX(CASE WHEN name = 'isEnableLifeStyles' THEN value END) AS isEnableLifeStyles
                        FROM systemflags
                    )
            
            select * from (SELECT u.id ,udd.fcmtoken , up.proposalUserId  as visitorId, up.status, u.firstName, u.middleName,u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl,  u.isVerifyProfilePic, upd.memberid
                , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                        , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                        ,upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                        , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                        , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1)  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1)  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,

                      ROUND( (( 
                            -- #1 Age 
                                (case WHEN ((uppu.pFromAge  <=(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y') + 0) ) && ((DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y') + 0)<= uppu.pToAge )) THEN 1 ELSE 0 END) * COALESCE(pw.pAgeWeight, 1) +
		                    -- #2 Height
                                (case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) * COALESCE(pw.pHeightWeight, 1) +
                            -- #3 Marital Status
                                (CASE WHEN (FIND_IN_SET (upd.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1 
                                WHEN uppu.pMaritalStatusId = 0 THEN 0.5
                                ELSE 0 END) * COALESCE(pw.pMaritalStatusWeight, 1) +
		                    -- #4 Profile with children
                                (case 
                                WHEN (uppu.pProfileWithChildren = 1) THEN
		            			    CASE WHEN (upd.haveChildren = 1 || upd.haveChildren = 2 ) THEN 1 ElSE 0 END
		            		            WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upd.haveChildren = 3) THEN 1 ElSE 0 END
                                        WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
		            	            ELSE 0 END) * COALESCE(pw.pProfileWithChildrenWeight, 1)  +
		                    -- #5 Family type
                                (case WHEN(sys.isEnableFamilyDetails = true) THEN
                                    CASE
                                        WHEN (upd.familyType = uppu.pFamilyType)  THEN 1 
                                        WHEN uppu.pFamilyType = 0 THEN 0.5
                                     ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pFamilyTypeWeight, 1) +
		                    -- #6 Religion 
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.religionId, (uppu.pReligionId)) > 0)  THEN 1 
                                    WHEN uppu.pReligionId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pReligionWeight, 1) +
		                    --  #7 Community
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.communityId, (uppu.pCommunityId)) > 0)  THEN 1 
                                    WHEN uppu.pCommunityId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCommunityWeight, 1) +
		                    --  #8 Mother tongue
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.motherTongue, (uppu.pMotherTongue)) > 0)  THEN 1 
		            	            ELSE 0 END) * COALESCE(pw.pMotherTongueWeight, 1) +
		                    --  #9 Horoscope Belief
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                    CASE
		            		            WHEN (uatd.horoscopeBelief = uppu.pHoroscopeBelief )  THEN 1 
                                        WHEN uppu.pHoroscopeBelief = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                            --  #10  Manglik Match
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                CASE
		            		            WHEN (uatd.manglik = uppu.pManglikMatch)  THEN 1 
                                        WHEN uppu.pManglikMatch = 0 THEN 0.5
                                ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pManglikMatchWeight, 1) +
		                    -- #11 Country
		            	        (case 
                                        WHEN (FIND_IN_SET (addr.countryId, uppu.pCountryLivingInId) > 0 )  THEN 1 
                                        WHEN uppu.pCountryLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCountryLivingInWeight, 1) +
                            -- #12 State
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.stateId, uppu.pStateLivingInId) > 0 )  THEN 1 
                                    WHEN uppu.pStateLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pStateLivingInWeight, 1) +
                            -- #13 City
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.cityId, uppu.pCityLivingInId) > 0 )  THEN 1
                                    WHEN uppu.pCityLivingInId = 0 THEN 0.5 
		            	        ELSE 0 END) * COALESCE(pw.pCityLivingInWeight, 1) +
                            -- #14 Education Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.educationTypeId, uppu.pEducationTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationTypeWeight, 1) +
                            -- #15 Education Medium
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.educationMediumId, uppu.pEducationMediumId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationMediumId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationMediumWeight, 1) +
                            -- #16 Occupation
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.occupationId, uppu.pOccupationId) > 0 )  THEN 1 
                                    WHEN uppu.pOccupationId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pOccupationWeight, 1) +
                            -- #17 Employment Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.employmentTypeId, uppu.pEmploymentTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEmploymentTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEmploymentTypeWeight, 1) +
                            -- #18 Annual Income
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.annualIncomeId, uppu.pAnnualIncomeId) > 0 )  THEN 1 
                                    WHEN uppu.pAnnualIncomeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pAnnualIncomeWeight, 1) +
                            -- #19 Diet
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (FIND_IN_SET (upd.dietId, uppu.pDietId) > 0 )  THEN 1 
                                        WHEN uppu.pDietId = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pDietWeight, 1) +
                            -- #20 Smoking
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upd.smoking = uppu.pSmokingAcceptance )  THEN 1 
                                        WHEN uppu.pSmokingAcceptance = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * (COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                            -- #21 Alcohol
		            	        (case WHEN (sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upd.drinking = uppu.pAlcoholAcceptance )  THEN 1 
                                        WHEN uppu.pAlcoholAcceptance = 0 THEN 0.5
                                    ELSE 0 END 
		            	        ELSE 1 END) * COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                            -- #22 Disability Acceptance
		            	        (case 
                                        WHEN (upd.anyDisability = uppu.pDisabilityAcceptance )  THEN 1 
                                        WHEN uppu.pDisabilityAcceptance = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                            --  #23 Complexion
                                (CASE 
		            		            WHEN (FIND_IN_SET (upd.complexion, (uppu.pComplexion)) > 0)  THEN 1 
                                        WHEN uppu.pComplexion = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pComplexionWeight, 1) +
                            --  #24 Body Type
                                (CASE 
		            		            WHEN (FIND_IN_SET (upd.bodyType, (uppu.pBodyType)) > 0)  THEN 1 
                                        WHEN uppu.pBodyType = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pBodyTypeWeight, 1)
                            ) )/ (
                                COALESCE(pw.pAgeWeight, 1) +
                                COALESCE(pw.pHeightWeight, 1)+
                                COALESCE(pw.pMaritalStatusWeight, 1) +
                                COALESCE(pw.pProfileWithChildrenWeight, 1) +
                                COALESCE(pw.pFamilyTypeWeight, 1) +
                                COALESCE(pw.pReligionWeight, 1) +
                                COALESCE(pw.pCommunityWeight, 1) +
                                COALESCE(pw.pMotherTongueWeight, 1) +
                                COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                                COALESCE(pw.pManglikMatchWeight, 1) +
                                COALESCE(pw.pCountryLivingInWeight, 1) +
                                COALESCE(pw.pStateLivingInWeight, 1) +
                                COALESCE(pw.pCityLivingInWeight, 1) +
                                COALESCE(pw.pEducationTypeWeight, 1) +
                                COALESCE(pw.pEducationMediumWeight, 1) +
                                COALESCE(pw.pOccupationWeight, 1) +
                                COALESCE(pw.pEmploymentTypeWeight, 1) +
                                COALESCE(pw.pAnnualIncomeWeight, 1) +
                                COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                                COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                                COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                                COALESCE(pw.pComplexionWeight, 1) +
                                COALESCE(pw.pBodyTypeWeight, 1) 
                        ))
                        * 100 ) AS matchingPercentage 
                , up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe ,
                up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
, IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
, IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
, (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
                                 FROM userproposals up
                                 LEFT JOIN users u ON u.id = up.proposalUserId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
									LEFT JOIN religion r ON r.id = upd.religionId
                LEFT JOIN community c ON c.id = upd.communityId
                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                LEFT JOIN education e ON e.id = upd.educationId
                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                 LEFT JOIN height h ON h.id = upd.heightId
                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                 LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId
                LEFT JOIN cities cit ON addr.cityId = cit.id
                LEFT JOIN districts ds ON addr.districtId = ds.id
                LEFT JOIN state st ON addr.stateId = st.id
                LEFT JOIN countries cou ON addr.countryId = cou.id 
                 LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
            LEFT JOIN weight w ON w.id = upd.weight
            LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` + userId + `
            LEFT JOIN users loginU ON loginU.id = ` + userId + `
            CROSS JOIN preference_weights pw
            CROSS JOIN disableScreen sys
                WHERE up.userId =` + userId + `
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
                                 and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)

                                 union

                                 SELECT u.id ,udd.fcmtoken , up.userId  as visitorId, up.status, u.firstName,u.middleName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl, u.isVerifyProfilePic, upd.memberid
                                 , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                        , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                        , upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                        , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                        , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1)  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1)  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,

                      ROUND( (( 
                            -- #1 Age 
                                (case WHEN ((uppu.pFromAge  <=(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y') + 0) ) && ((DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y') + 0)<= uppu.pToAge )) THEN 1 ELSE 0 END) * COALESCE(pw.pAgeWeight, 1) +
		                    -- #2 Height
                                (case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) * COALESCE(pw.pHeightWeight, 1) +
                            -- #3 Marital Status
                                (CASE WHEN (FIND_IN_SET (upd.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1 
                                WHEN uppu.pMaritalStatusId = 0 THEN 0.5
                                ELSE 0 END) * COALESCE(pw.pMaritalStatusWeight, 1) +
		                    -- #4 Profile with children
                                (case 
                                WHEN (uppu.pProfileWithChildren = 1) THEN
		            			    CASE WHEN (upd.haveChildren = 1 || upd.haveChildren = 2 ) THEN 1 ElSE 0 END
		            		            WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upd.haveChildren = 3) THEN 1 ElSE 0 END
                                        WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
		            	            ELSE 0 END) * COALESCE(pw.pProfileWithChildrenWeight, 1)  +
		                    -- #5 Family type
                                (case WHEN(sys.isEnableFamilyDetails = true) THEN
                                    CASE
                                        WHEN (upd.familyType = uppu.pFamilyType)  THEN 1 
                                        WHEN uppu.pFamilyType = 0 THEN 0.5
                                     ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pFamilyTypeWeight, 1) +
		                    -- #6 Religion 
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.religionId, (uppu.pReligionId)) > 0)  THEN 1 
                                    WHEN uppu.pReligionId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pReligionWeight, 1) +
		                    --  #7 Community
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.communityId, (uppu.pCommunityId)) > 0)  THEN 1 
                                    WHEN uppu.pCommunityId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCommunityWeight, 1) +
		                    --  #8 Mother tongue
                                (CASE 
		            		        WHEN (FIND_IN_SET (upd.motherTongue, (uppu.pMotherTongue)) > 0)  THEN 1 
		            	            ELSE 0 END) * COALESCE(pw.pMotherTongueWeight, 1) +
		                    --  #9 Horoscope Belief
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                    CASE
		            		            WHEN (uatd.horoscopeBelief = uppu.pHoroscopeBelief )  THEN 1 
                                        WHEN uppu.pHoroscopeBelief = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                            --  #10  Manglik Match
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                CASE
		            		            WHEN (uatd.manglik = uppu.pManglikMatch)  THEN 1 
                                        WHEN uppu.pManglikMatch = 0 THEN 0.5
                                ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pManglikMatchWeight, 1) +
		                    -- #11 Country
		            	        (case 
                                        WHEN (FIND_IN_SET (addr.countryId, uppu.pCountryLivingInId) > 0 )  THEN 1 
                                        WHEN uppu.pCountryLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCountryLivingInWeight, 1) +
                            -- #12 State
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.stateId, uppu.pStateLivingInId) > 0 )  THEN 1 
                                    WHEN uppu.pStateLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pStateLivingInWeight, 1) +
                            -- #13 City
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.cityId, uppu.pCityLivingInId) > 0 )  THEN 1
                                    WHEN uppu.pCityLivingInId = 0 THEN 0.5 
		            	        ELSE 0 END) * COALESCE(pw.pCityLivingInWeight, 1) +
                            -- #14 Education Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.educationTypeId, uppu.pEducationTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationTypeWeight, 1) +
                            -- #15 Education Medium
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.educationMediumId, uppu.pEducationMediumId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationMediumId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationMediumWeight, 1) +
                            -- #16 Occupation
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.occupationId, uppu.pOccupationId) > 0 )  THEN 1 
                                    WHEN uppu.pOccupationId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pOccupationWeight, 1) +
                            -- #17 Employment Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.employmentTypeId, uppu.pEmploymentTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEmploymentTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEmploymentTypeWeight, 1) +
                            -- #18 Annual Income
		            	        (case 
                                    WHEN (FIND_IN_SET (upd.annualIncomeId, uppu.pAnnualIncomeId) > 0 )  THEN 1 
                                    WHEN uppu.pAnnualIncomeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pAnnualIncomeWeight, 1) +
                            -- #19 Diet
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (FIND_IN_SET (upd.dietId, uppu.pDietId) > 0 )  THEN 1 
                                        WHEN uppu.pDietId = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pDietWeight, 1) +
                            -- #20 Smoking
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upd.smoking = uppu.pSmokingAcceptance )  THEN 1 
                                        WHEN uppu.pSmokingAcceptance = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * (COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                            -- #21 Alcohol
		            	        (case WHEN (sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upd.drinking = uppu.pAlcoholAcceptance )  THEN 1 
                                        WHEN uppu.pAlcoholAcceptance = 0 THEN 0.5
                                    ELSE 0 END 
		            	        ELSE 1 END) * COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                            -- #22 Disability Acceptance
		            	        (case 
                                        WHEN (upd.anyDisability = uppu.pDisabilityAcceptance )  THEN 1 
                                        WHEN uppu.pDisabilityAcceptance = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                            --  #23 Complexion
                                (CASE 
		            		            WHEN (FIND_IN_SET (upd.complexion, (uppu.pComplexion)) > 0)  THEN 1 
                                        WHEN uppu.pComplexion = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pComplexionWeight, 1) +
                            --  #24 Body Type
                                (CASE 
		            		            WHEN (FIND_IN_SET (upd.bodyType, (uppu.pBodyType)) > 0)  THEN 1 
                                        WHEN uppu.pBodyType = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pBodyTypeWeight, 1)
                            ) )/ (
                                COALESCE(pw.pAgeWeight, 1) +
                                COALESCE(pw.pHeightWeight, 1)+
                                COALESCE(pw.pMaritalStatusWeight, 1) +
                                COALESCE(pw.pProfileWithChildrenWeight, 1) +
                                COALESCE(pw.pFamilyTypeWeight, 1) +
                                COALESCE(pw.pReligionWeight, 1) +
                                COALESCE(pw.pCommunityWeight, 1) +
                                COALESCE(pw.pMotherTongueWeight, 1) +
                                COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                                COALESCE(pw.pManglikMatchWeight, 1) +
                                COALESCE(pw.pCountryLivingInWeight, 1) +
                                COALESCE(pw.pStateLivingInWeight, 1) +
                                COALESCE(pw.pCityLivingInWeight, 1) +
                                COALESCE(pw.pEducationTypeWeight, 1) +
                                COALESCE(pw.pEducationMediumWeight, 1) +
                                COALESCE(pw.pOccupationWeight, 1) +
                                COALESCE(pw.pEmploymentTypeWeight, 1) +
                                COALESCE(pw.pAnnualIncomeWeight, 1) +
                                COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                                COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                                COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                                COALESCE(pw.pComplexionWeight, 1) +
                                COALESCE(pw.pBodyTypeWeight, 1) 
                        ))
                        * 100 ) AS matchingPercentage 
                                , up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe ,
                                 up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther
                                 , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) OR (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposed
                 , IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
                 , IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = u.id)) > 0,true,false) as isProposalSent
                 ,  IF((select COUNT(id) from userproposals where (proposalUserId = u.id) AND hascancelled = 1) > 0,true,false) as hascancelled
                 , (select status from userproposals where ((proposalUserId = u.id AND userId = ` + userId + `) OR (userId = u.id AND proposalUserId = ` + userId + `)) AND hascancelled = 0 ) as proposalStatus
                                 , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
                                , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
                                 FROM userproposals up
                                 LEFT JOIN users u ON u.id = up.userId
                                 LEFT JOIN images img ON img.id = u.imageId
                                 LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                 LEFT JOIN maritalstatus ms ON ms.id = upd.maritalStatusId
                                 LEFT JOIN religion r ON r.id = upd.religionId
                LEFT JOIN community c ON c.id = upd.communityId
                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                LEFT JOIN education e ON e.id = upd.educationId
                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                LEFT JOIN diet d ON d.id = upd.dietId
                 LEFT JOIN height h ON h.id = upd.heightId
                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                 LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 LEFT JOIN occupation o ON o.id = upd.occupationId
                                 LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                 LEFT JOIN addresses addr ON addr.id = upd.addressId
                LEFT JOIN cities cit ON addr.cityId = cit.id
                LEFT JOIN districts ds ON addr.districtId = ds.id
                LEFT JOIN state st ON addr.stateId = st.id
                LEFT JOIN countries cou ON addr.countryId = cou.id 
                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
            LEFT JOIN weight w ON w.id = upd.weight
            LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` + userId + `
            LEFT JOIN users loginU ON loginU.id = ` + userId + `
            CROSS JOIN preference_weights pw
            CROSS JOIN disableScreen sys WHERE up.proposalUserId = ` + userId + `
                                 and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
                                 and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                                 and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))
                                 as t1 WHERE t1.status = true`;
            // let sql = `select * from (SELECT u.id ,udd.fcmtoken , up.proposalUserId  as visitorId, up.status, u.firstName, u.middleName,u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as imageUrl, o.name as occupation
            //     , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName
            //     , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
            //     , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName, ms.name as maritalStatus,ai.value as annualIncome, d.name as diet
            //     , r.name as religion, c.name as community,sc.name as subCommunity,e.name as education
            //     , addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age 
            //     , up.proposalUserId IN (select userBlockId from userblock where userId =` + userId + `)  as isBlockByMe , 
            //                     up.proposalUserId IN (select userId from userblock where userBlockId =` + userId + `)  as isBlockByOther,
            //                     u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            //                     u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            //                      FROM userproposals up 
            //                      LEFT JOIN users u ON u.id = up.proposalUserId
            //                      LEFT JOIN images img ON img.id = u.imageId
            //                      LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            //                      LEFT JOIN profilefor pf ON pf.id = upd.profileForId
            //                      LEFT JOIN occupation o ON o.id = upd.occupationId
            //                      LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.userId =` + userId + ` 
            //                      and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)   
            //                      and u.id NOT IN (select userId from userblock where userBlockId =` + userId + `)
            //                      and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
            //                      union 
            //                      SELECT u.id , up.userId  as visitorId, up.status, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl as image, o.name as occupation
            //                      , upd.birthDate, upd.eyeColor, upd.languages, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId , pf.name as profileForName, 
            //                      addr.cityName, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upd.birthDate)), '%Y') + 0 AS age,
            //                      up.proposalUserId IN (select userBlockId from userblock where userId = ` + userId + `)  as isBlockByMe , 
            //                     up.proposalUserId IN (select userId from userblock where userBlockId = ` + userId + `)  as isBlockByOther,
            //                     u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            //                     u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            //                      FROM userproposals up 
            //                      LEFT JOIN users u ON u.id = up.userId
            //                      LEFT JOIN images img ON img.id = u.imageId
            //                      LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
            //                      LEFT JOIN profilefor pf ON pf.id = upd.profileForId
            //                      LEFT JOIN occupation o ON o.id = upd.occupationId
            //                      LEFT JOIN addresses addr ON addr.id = upd.addressId WHERE up.proposalUserId = ` + userId + ` 
            //                      and u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
            //                      and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
            //                      and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `))  
            //                      as t1 WHERE t1.status = true`;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + " ";
            }
            console.log(sql);
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    result[i].isVerifiedProfile = false;
                    let isVerified = true;
                    let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + result[i].id;
                    let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                    if (docVerifiedResult && docVerifiedResult.length > 0) {
                        for (let j = 0; j < docVerifiedResult.length; j++) {
                            if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                                isVerified = false;
                            }
                        }
                    }
                    else {
                        isVerified = false;
                    }
                    result[i].isVerifiedProfile = isVerified;
                    if (result[i].isVerifyProfilePic) {
                        result[i].isVerifyProfilePic = true;
                    }
                    else {
                        result[i].isVerifyProfilePic = false;
                    }
                    // region to get user personal custom data
                    let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(result[i].id);
                    if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                        console.log(_customFieldDataResult);
                        result[i].customFields = _customFieldDataResult;
                    }
                    let userDetailResponse = yield customFields_1.default.getUserData(result[i]);
                    result[i] = Object.assign(Object.assign({}, result[i]), userDetailResponse);
                    // if (isCustomFieldEnabled) {
                    //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + result[i].id;
                    //     let userCustomDataResult = await header.query(userCustomDataSql);
                    //     let customdata: any[] = [];
                    //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                    //         const userCustomDataArrays = [];
                    //         const keys = Object.keys(userCustomDataResult[0]);
                    //         userCustomDataArrays.push(keys);
                    //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                    //         for (let j = 0; j < filteredColumns.length; j++) {
                    //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[j] + `' and isActive = 1`;
                    //             let filterColumnResult = await header.query(sql);
                    //             let userDataSql = `SELECT ` + filteredColumns[j] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + result[i].id;
                    //             let userDataResult = await header.query(userDataSql);
                    //             let mergedResult = Object.assign({}, filterColumnResult[0], userDataResult[0]);
                    //             customdata.push(mergedResult);
                    //             console.log(userCustomDataResult);
                    //         }
                    //         if (customdata && customdata.length > 0) {
                    //             for (let i = 0; i < customdata.length; i++) {
                    //                 if (customdata[i].valueList) {
                    //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                    //                     customdata[i].valueList = valueListArray;
                    //                 }
                    //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                    //                     if (customdata[i].valueTypeId == 10) {
                    //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                    //                         customdata[i].value = valueArray;
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //         result[i].customFields = customdata;
                    //     }
                    // }
                    // end region to get user personal custom data 
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Visitors', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, "visitors.getVisitors() Error", new Error('Error While Getting Data'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'visitors.getVisitors() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getVisitors };
