import { Program } from '@coral-xyz/anchor';
import { PublicKey, SendTransactionError, TransactionMessage, VersionedTransaction, Transaction, ComputeBudgetProgram, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction, TOKEN_2022_PROGRAM_ID as TOKEN_2022_PROGRAM_ID$1 } from '@solana/spl-token';
import { struct, u64, bool, publicKey } from '@coral-xyz/borsh';
import BN from 'bn.js';
import { searcherClient } from 'jito-ts/dist/sdk/block-engine/searcher.js';
import { Bundle } from 'jito-ts/dist/sdk/block-engine/types.js';
import http from 'http';
import https from 'https';

var address = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
var metadata = {
	name: "pump",
	version: "0.1.0",
	spec: "0.1.0",
	description: "Created with Anchor"
};
var instructions = [
	{
		name: "admin_set_creator",
		docs: [
			"Allows Global::admin_set_creator_authority to override the bonding curve creator"
		],
		discriminator: [
			69,
			25,
			171,
			142,
			57,
			239,
			13,
			4
		],
		accounts: [
			{
				name: "admin_set_creator_authority",
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "mint"
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "creator",
				type: "pubkey"
			}
		]
	},
	{
		name: "admin_set_idl_authority",
		discriminator: [
			8,
			217,
			96,
			231,
			144,
			104,
			192,
			5
		],
		accounts: [
			{
				name: "authority",
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "idl_account",
				writable: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "program_signer",
				pda: {
					seeds: [
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "idl_authority",
				type: "pubkey"
			}
		]
	},
	{
		name: "admin_update_token_incentives",
		discriminator: [
			209,
			11,
			115,
			87,
			213,
			23,
			124,
			204
		],
		accounts: [
			{
				name: "authority",
				writable: true,
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "global_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						}
					]
				}
			},
			{
				name: "mint"
			},
			{
				name: "global_incentive_token_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "global_volume_accumulator"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "token_program"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "start_time",
				type: "i64"
			},
			{
				name: "end_time",
				type: "i64"
			},
			{
				name: "seconds_in_a_day",
				type: "i64"
			},
			{
				name: "day_number",
				type: "u64"
			},
			{
				name: "pump_token_supply_per_day",
				type: "u64"
			}
		]
	},
	{
		name: "buy",
		docs: [
			"Buys tokens from a bonding curve."
		],
		discriminator: [
			102,
			6,
			61,
			18,
			1,
			218,
			235,
			234
		],
		accounts: [
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "fee_recipient",
				writable: true
			},
			{
				name: "mint"
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "associated_bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "bonding_curve"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "associated_user",
				writable: true
			},
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "creator_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								99,
								114,
								101,
								97,
								116,
								111,
								114,
								45,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "account",
							path: "bonding_curve.creator",
							account: "BondingCurve"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			},
			{
				name: "global_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						}
					]
				}
			},
			{
				name: "user_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "fee_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								102,
								101,
								101,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "const",
							value: [
								1,
								86,
								224,
								246,
								147,
								102,
								90,
								207,
								68,
								219,
								21,
								104,
								191,
								23,
								91,
								170,
								81,
								137,
								203,
								151,
								245,
								210,
								255,
								59,
								101,
								93,
								43,
								182,
								253,
								109,
								24,
								176
							]
						}
					],
					program: {
						kind: "account",
						path: "fee_program"
					}
				}
			},
			{
				name: "fee_program",
				address: "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
			}
		],
		args: [
			{
				name: "amount",
				type: "u64"
			},
			{
				name: "max_sol_cost",
				type: "u64"
			}
		]
	},
	{
		name: "claim_token_incentives",
		discriminator: [
			16,
			4,
			71,
			28,
			204,
			1,
			40,
			27
		],
		accounts: [
			{
				name: "user"
			},
			{
				name: "user_ata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "user"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "global_volume_accumulator",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						}
					]
				}
			},
			{
				name: "global_incentive_token_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "global_volume_accumulator"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "mint",
				relations: [
					"global_volume_accumulator"
				]
			},
			{
				name: "token_program"
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			},
			{
				name: "payer",
				writable: true,
				signer: true
			}
		],
		args: [
		]
	},
	{
		name: "close_user_volume_accumulator",
		discriminator: [
			249,
			69,
			164,
			218,
			150,
			103,
			84,
			138
		],
		accounts: [
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "user_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "collect_creator_fee",
		docs: [
			"Collects creator_fee from creator_vault to the coin creator account"
		],
		discriminator: [
			20,
			22,
			86,
			123,
			198,
			28,
			219,
			132
		],
		accounts: [
			{
				name: "creator",
				writable: true
			},
			{
				name: "creator_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								99,
								114,
								101,
								97,
								116,
								111,
								114,
								45,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "account",
							path: "creator"
						}
					]
				}
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "create",
		docs: [
			"Creates a new coin and bonding curve."
		],
		discriminator: [
			24,
			30,
			200,
			40,
			5,
			28,
			7,
			119
		],
		accounts: [
			{
				name: "mint",
				writable: true,
				signer: true
			},
			{
				name: "mint_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								105,
								110,
								116,
								45,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "associated_bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "bonding_curve"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "mpl_token_metadata",
				address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
			},
			{
				name: "metadata",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								101,
								116,
								97,
								100,
								97,
								116,
								97
							]
						},
						{
							kind: "const",
							value: [
								11,
								112,
								101,
								177,
								227,
								209,
								124,
								69,
								56,
								157,
								82,
								127,
								107,
								4,
								195,
								205,
								88,
								184,
								108,
								115,
								26,
								160,
								253,
								181,
								73,
								182,
								209,
								188,
								3,
								248,
								41,
								70
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "account",
						path: "mpl_token_metadata"
					}
				}
			},
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "rent",
				address: "SysvarRent111111111111111111111111111111111"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "name",
				type: "string"
			},
			{
				name: "symbol",
				type: "string"
			},
			{
				name: "uri",
				type: "string"
			},
			{
				name: "creator",
				type: "pubkey"
			}
		]
	},
	{
		name: "extend_account",
		docs: [
			"Extends the size of program-owned accounts"
		],
		discriminator: [
			234,
			102,
			194,
			203,
			150,
			72,
			62,
			229
		],
		accounts: [
			{
				name: "account",
				writable: true
			},
			{
				name: "user",
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "init_user_volume_accumulator",
		discriminator: [
			94,
			6,
			202,
			115,
			255,
			96,
			232,
			183
		],
		accounts: [
			{
				name: "payer",
				writable: true,
				signer: true
			},
			{
				name: "user"
			},
			{
				name: "user_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "initialize",
		docs: [
			"Creates the global state."
		],
		discriminator: [
			175,
			175,
			109,
			31,
			13,
			152,
			155,
			237
		],
		accounts: [
			{
				name: "global",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			}
		],
		args: [
		]
	},
	{
		name: "migrate",
		docs: [
			"Migrates liquidity to pump_amm if the bonding curve is complete"
		],
		discriminator: [
			155,
			234,
			231,
			146,
			236,
			158,
			162,
			30
		],
		accounts: [
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "withdraw_authority",
				writable: true,
				relations: [
					"global"
				]
			},
			{
				name: "mint"
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "associated_bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "bonding_curve"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "user",
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "pump_amm",
				address: "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
			},
			{
				name: "pool",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108
							]
						},
						{
							kind: "const",
							value: [
								0,
								0
							]
						},
						{
							kind: "account",
							path: "pool_authority"
						},
						{
							kind: "account",
							path: "mint"
						},
						{
							kind: "account",
							path: "wsol_mint"
						}
					],
					program: {
						kind: "account",
						path: "pump_amm"
					}
				}
			},
			{
				name: "pool_authority",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								45,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "pool_authority_mint_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "pool_authority"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "account",
						path: "associated_token_program"
					}
				}
			},
			{
				name: "pool_authority_wsol_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "pool_authority"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "wsol_mint"
						}
					],
					program: {
						kind: "account",
						path: "associated_token_program"
					}
				}
			},
			{
				name: "amm_global_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						}
					],
					program: {
						kind: "account",
						path: "pump_amm"
					}
				}
			},
			{
				name: "wsol_mint",
				address: "So11111111111111111111111111111111111111112"
			},
			{
				name: "lp_mint",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								112,
								111,
								111,
								108,
								95,
								108,
								112,
								95,
								109,
								105,
								110,
								116
							]
						},
						{
							kind: "account",
							path: "pool"
						}
					],
					program: {
						kind: "account",
						path: "pump_amm"
					}
				}
			},
			{
				name: "user_pool_token_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "pool_authority"
						},
						{
							kind: "account",
							path: "token_2022_program"
						},
						{
							kind: "account",
							path: "lp_mint"
						}
					],
					program: {
						kind: "account",
						path: "associated_token_program"
					}
				}
			},
			{
				name: "pool_base_token_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "pool"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "account",
						path: "associated_token_program"
					}
				}
			},
			{
				name: "pool_quote_token_account",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "pool"
						},
						{
							kind: "account",
							path: "token_program"
						},
						{
							kind: "account",
							path: "wsol_mint"
						}
					],
					program: {
						kind: "account",
						path: "associated_token_program"
					}
				}
			},
			{
				name: "token_2022_program",
				address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
			},
			{
				name: "associated_token_program",
				address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
			},
			{
				name: "pump_amm_event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					],
					program: {
						kind: "account",
						path: "pump_amm"
					}
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "sell",
		docs: [
			"Sells tokens into a bonding curve."
		],
		discriminator: [
			51,
			230,
			133,
			164,
			1,
			127,
			131,
			173
		],
		accounts: [
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "fee_recipient",
				writable: true
			},
			{
				name: "mint"
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "associated_bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "account",
							path: "bonding_curve"
						},
						{
							kind: "const",
							value: [
								6,
								221,
								246,
								225,
								215,
								101,
								161,
								147,
								217,
								203,
								225,
								70,
								206,
								235,
								121,
								172,
								28,
								180,
								133,
								237,
								95,
								91,
								55,
								145,
								58,
								140,
								245,
								133,
								126,
								255,
								0,
								169
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							140,
							151,
							37,
							143,
							78,
							36,
							137,
							241,
							187,
							61,
							16,
							41,
							20,
							142,
							13,
							131,
							11,
							90,
							19,
							153,
							218,
							255,
							16,
							132,
							4,
							142,
							123,
							216,
							219,
							233,
							248,
							89
						]
					}
				}
			},
			{
				name: "associated_user",
				writable: true
			},
			{
				name: "user",
				writable: true,
				signer: true
			},
			{
				name: "system_program",
				address: "11111111111111111111111111111111"
			},
			{
				name: "creator_vault",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								99,
								114,
								101,
								97,
								116,
								111,
								114,
								45,
								118,
								97,
								117,
								108,
								116
							]
						},
						{
							kind: "account",
							path: "bonding_curve.creator",
							account: "BondingCurve"
						}
					]
				}
			},
			{
				name: "token_program",
				address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program",
				address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
			},
			{
				name: "fee_config",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								102,
								101,
								101,
								95,
								99,
								111,
								110,
								102,
								105,
								103
							]
						},
						{
							kind: "const",
							value: [
								1,
								86,
								224,
								246,
								147,
								102,
								90,
								207,
								68,
								219,
								21,
								104,
								191,
								23,
								91,
								170,
								81,
								137,
								203,
								151,
								245,
								210,
								255,
								59,
								101,
								93,
								43,
								182,
								253,
								109,
								24,
								176
							]
						}
					],
					program: {
						kind: "account",
						path: "fee_program"
					}
				}
			},
			{
				name: "fee_program",
				address: "pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ"
			}
		],
		args: [
			{
				name: "amount",
				type: "u64"
			},
			{
				name: "min_sol_output",
				type: "u64"
			}
		]
	},
	{
		name: "set_creator",
		docs: [
			"Allows Global::set_creator_authority to set the bonding curve creator from Metaplex metadata or input argument"
		],
		discriminator: [
			254,
			148,
			255,
			112,
			207,
			142,
			170,
			165
		],
		accounts: [
			{
				name: "set_creator_authority",
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "global",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "mint"
			},
			{
				name: "metadata",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								101,
								116,
								97,
								100,
								97,
								116,
								97
							]
						},
						{
							kind: "const",
							value: [
								11,
								112,
								101,
								177,
								227,
								209,
								124,
								69,
								56,
								157,
								82,
								127,
								107,
								4,
								195,
								205,
								88,
								184,
								108,
								115,
								26,
								160,
								253,
								181,
								73,
								182,
								209,
								188,
								3,
								248,
								41,
								70
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							11,
							112,
							101,
							177,
							227,
							209,
							124,
							69,
							56,
							157,
							82,
							127,
							107,
							4,
							195,
							205,
							88,
							184,
							108,
							115,
							26,
							160,
							253,
							181,
							73,
							182,
							209,
							188,
							3,
							248,
							41,
							70
						]
					}
				}
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "creator",
				type: "pubkey"
			}
		]
	},
	{
		name: "set_metaplex_creator",
		docs: [
			"Syncs the bonding curve creator with the Metaplex metadata creator if it exists"
		],
		discriminator: [
			138,
			96,
			174,
			217,
			48,
			85,
			197,
			246
		],
		accounts: [
			{
				name: "mint"
			},
			{
				name: "metadata",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								109,
								101,
								116,
								97,
								100,
								97,
								116,
								97
							]
						},
						{
							kind: "const",
							value: [
								11,
								112,
								101,
								177,
								227,
								209,
								124,
								69,
								56,
								157,
								82,
								127,
								107,
								4,
								195,
								205,
								88,
								184,
								108,
								115,
								26,
								160,
								253,
								181,
								73,
								182,
								209,
								188,
								3,
								248,
								41,
								70
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					],
					program: {
						kind: "const",
						value: [
							11,
							112,
							101,
							177,
							227,
							209,
							124,
							69,
							56,
							157,
							82,
							127,
							107,
							4,
							195,
							205,
							88,
							184,
							108,
							115,
							26,
							160,
							253,
							181,
							73,
							182,
							209,
							188,
							3,
							248,
							41,
							70
						]
					}
				}
			},
			{
				name: "bonding_curve",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								98,
								111,
								110,
								100,
								105,
								110,
								103,
								45,
								99,
								117,
								114,
								118,
								101
							]
						},
						{
							kind: "account",
							path: "mint"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "set_params",
		docs: [
			"Sets the global state parameters."
		],
		discriminator: [
			27,
			234,
			178,
			52,
			147,
			2,
			187,
			141
		],
		accounts: [
			{
				name: "global",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "authority",
				writable: true,
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
			{
				name: "initial_virtual_token_reserves",
				type: "u64"
			},
			{
				name: "initial_virtual_sol_reserves",
				type: "u64"
			},
			{
				name: "initial_real_token_reserves",
				type: "u64"
			},
			{
				name: "token_total_supply",
				type: "u64"
			},
			{
				name: "fee_basis_points",
				type: "u64"
			},
			{
				name: "withdraw_authority",
				type: "pubkey"
			},
			{
				name: "enable_migrate",
				type: "bool"
			},
			{
				name: "pool_migration_fee",
				type: "u64"
			},
			{
				name: "creator_fee_basis_points",
				type: "u64"
			},
			{
				name: "set_creator_authority",
				type: "pubkey"
			},
			{
				name: "admin_set_creator_authority",
				type: "pubkey"
			}
		]
	},
	{
		name: "sync_user_volume_accumulator",
		discriminator: [
			86,
			31,
			192,
			87,
			163,
			87,
			79,
			238
		],
		accounts: [
			{
				name: "user"
			},
			{
				name: "global_volume_accumulator",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						}
					]
				}
			},
			{
				name: "user_volume_accumulator",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								117,
								115,
								101,
								114,
								95,
								118,
								111,
								108,
								117,
								109,
								101,
								95,
								97,
								99,
								99,
								117,
								109,
								117,
								108,
								97,
								116,
								111,
								114
							]
						},
						{
							kind: "account",
							path: "user"
						}
					]
				}
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	},
	{
		name: "update_global_authority",
		discriminator: [
			227,
			181,
			74,
			196,
			208,
			21,
			97,
			213
		],
		accounts: [
			{
				name: "global",
				writable: true,
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								103,
								108,
								111,
								98,
								97,
								108
							]
						}
					]
				}
			},
			{
				name: "authority",
				signer: true,
				relations: [
					"global"
				]
			},
			{
				name: "new_authority"
			},
			{
				name: "event_authority",
				pda: {
					seeds: [
						{
							kind: "const",
							value: [
								95,
								95,
								101,
								118,
								101,
								110,
								116,
								95,
								97,
								117,
								116,
								104,
								111,
								114,
								105,
								116,
								121
							]
						}
					]
				}
			},
			{
				name: "program"
			}
		],
		args: [
		]
	}
];
var accounts = [
	{
		name: "BondingCurve",
		discriminator: [
			23,
			183,
			248,
			55,
			96,
			216,
			172,
			96
		]
	},
	{
		name: "FeeConfig",
		discriminator: [
			143,
			52,
			146,
			187,
			219,
			123,
			76,
			155
		]
	},
	{
		name: "Global",
		discriminator: [
			167,
			232,
			232,
			177,
			200,
			108,
			114,
			127
		]
	},
	{
		name: "GlobalVolumeAccumulator",
		discriminator: [
			202,
			42,
			246,
			43,
			142,
			190,
			30,
			255
		]
	},
	{
		name: "UserVolumeAccumulator",
		discriminator: [
			86,
			255,
			112,
			14,
			102,
			53,
			154,
			250
		]
	}
];
var events = [
	{
		name: "AdminSetCreatorEvent",
		discriminator: [
			64,
			69,
			192,
			104,
			29,
			30,
			25,
			107
		]
	},
	{
		name: "AdminSetIdlAuthorityEvent",
		discriminator: [
			245,
			59,
			70,
			34,
			75,
			185,
			109,
			92
		]
	},
	{
		name: "AdminUpdateTokenIncentivesEvent",
		discriminator: [
			147,
			250,
			108,
			120,
			247,
			29,
			67,
			222
		]
	},
	{
		name: "ClaimTokenIncentivesEvent",
		discriminator: [
			79,
			172,
			246,
			49,
			205,
			91,
			206,
			232
		]
	},
	{
		name: "CloseUserVolumeAccumulatorEvent",
		discriminator: [
			146,
			159,
			189,
			172,
			146,
			88,
			56,
			244
		]
	},
	{
		name: "CollectCreatorFeeEvent",
		discriminator: [
			122,
			2,
			127,
			1,
			14,
			191,
			12,
			175
		]
	},
	{
		name: "CompleteEvent",
		discriminator: [
			95,
			114,
			97,
			156,
			212,
			46,
			152,
			8
		]
	},
	{
		name: "CompletePumpAmmMigrationEvent",
		discriminator: [
			189,
			233,
			93,
			185,
			92,
			148,
			234,
			148
		]
	},
	{
		name: "CreateEvent",
		discriminator: [
			27,
			114,
			169,
			77,
			222,
			235,
			99,
			118
		]
	},
	{
		name: "ExtendAccountEvent",
		discriminator: [
			97,
			97,
			215,
			144,
			93,
			146,
			22,
			124
		]
	},
	{
		name: "InitUserVolumeAccumulatorEvent",
		discriminator: [
			134,
			36,
			13,
			72,
			232,
			101,
			130,
			216
		]
	},
	{
		name: "SetCreatorEvent",
		discriminator: [
			237,
			52,
			123,
			37,
			245,
			251,
			72,
			210
		]
	},
	{
		name: "SetMetaplexCreatorEvent",
		discriminator: [
			142,
			203,
			6,
			32,
			127,
			105,
			191,
			162
		]
	},
	{
		name: "SetParamsEvent",
		discriminator: [
			223,
			195,
			159,
			246,
			62,
			48,
			143,
			131
		]
	},
	{
		name: "SyncUserVolumeAccumulatorEvent",
		discriminator: [
			197,
			122,
			167,
			124,
			116,
			81,
			91,
			255
		]
	},
	{
		name: "TradeEvent",
		discriminator: [
			189,
			219,
			127,
			211,
			78,
			230,
			97,
			238
		]
	},
	{
		name: "UpdateGlobalAuthorityEvent",
		discriminator: [
			182,
			195,
			137,
			42,
			35,
			206,
			207,
			247
		]
	}
];
var errors = [
	{
		code: 6000,
		name: "NotAuthorized",
		msg: "The given account is not authorized to execute this instruction."
	},
	{
		code: 6001,
		name: "AlreadyInitialized",
		msg: "The program is already initialized."
	},
	{
		code: 6002,
		name: "TooMuchSolRequired",
		msg: "slippage: Too much SOL required to buy the given amount of tokens."
	},
	{
		code: 6003,
		name: "TooLittleSolReceived",
		msg: "slippage: Too little SOL received to sell the given amount of tokens."
	},
	{
		code: 6004,
		name: "MintDoesNotMatchBondingCurve",
		msg: "The mint does not match the bonding curve."
	},
	{
		code: 6005,
		name: "BondingCurveComplete",
		msg: "The bonding curve has completed and liquidity migrated to raydium."
	},
	{
		code: 6006,
		name: "BondingCurveNotComplete",
		msg: "The bonding curve has not completed."
	},
	{
		code: 6007,
		name: "NotInitialized",
		msg: "The program is not initialized."
	},
	{
		code: 6008,
		name: "WithdrawTooFrequent",
		msg: "Withdraw too frequent"
	},
	{
		code: 6009,
		name: "NewSizeShouldBeGreaterThanCurrentSize",
		msg: "new_size should be > current_size"
	},
	{
		code: 6010,
		name: "AccountTypeNotSupported",
		msg: "Account type not supported"
	},
	{
		code: 6011,
		name: "InitialRealTokenReservesShouldBeLessThanTokenTotalSupply",
		msg: "initial_real_token_reserves should be less than token_total_supply"
	},
	{
		code: 6012,
		name: "InitialVirtualTokenReservesShouldBeGreaterThanInitialRealTokenReserves",
		msg: "initial_virtual_token_reserves should be greater than initial_real_token_reserves"
	},
	{
		code: 6013,
		name: "FeeBasisPointsGreaterThanMaximum",
		msg: "fee_basis_points greater than maximum"
	},
	{
		code: 6014,
		name: "AllZerosWithdrawAuthority",
		msg: "Withdraw authority cannot be set to System Program ID"
	},
	{
		code: 6015,
		name: "PoolMigrationFeeShouldBeLessThanFinalRealSolReserves",
		msg: "pool_migration_fee should be less than final_real_sol_reserves"
	},
	{
		code: 6016,
		name: "PoolMigrationFeeShouldBeGreaterThanCreatorFeePlusMaxMigrateFees",
		msg: "pool_migration_fee should be greater than creator_fee + MAX_MIGRATE_FEES"
	},
	{
		code: 6017,
		name: "DisabledWithdraw",
		msg: "Migrate instruction is disabled"
	},
	{
		code: 6018,
		name: "DisabledMigrate",
		msg: "Migrate instruction is disabled"
	},
	{
		code: 6019,
		name: "InvalidCreator",
		msg: "Invalid creator pubkey"
	},
	{
		code: 6020,
		name: "BuyZeroAmount",
		msg: "Buy zero amount"
	},
	{
		code: 6021,
		name: "NotEnoughTokensToBuy",
		msg: "Not enough tokens to buy"
	},
	{
		code: 6022,
		name: "SellZeroAmount",
		msg: "Sell zero amount"
	},
	{
		code: 6023,
		name: "NotEnoughTokensToSell",
		msg: "Not enough tokens to sell"
	},
	{
		code: 6024,
		name: "Overflow",
		msg: "Overflow"
	},
	{
		code: 6025,
		name: "Truncation",
		msg: "Truncation"
	},
	{
		code: 6026,
		name: "DivisionByZero",
		msg: "Division by zero"
	},
	{
		code: 6027,
		name: "NotEnoughRemainingAccounts",
		msg: "Not enough remaining accounts"
	},
	{
		code: 6028,
		name: "AllFeeRecipientsShouldBeNonZero",
		msg: "All fee recipients should be non-zero"
	},
	{
		code: 6029,
		name: "UnsortedNotUniqueFeeRecipients",
		msg: "Unsorted or not unique fee recipients"
	},
	{
		code: 6030,
		name: "CreatorShouldNotBeZero",
		msg: "Creator should not be zero"
	},
	{
		code: 6031,
		name: "StartTimeInThePast"
	},
	{
		code: 6032,
		name: "EndTimeInThePast"
	},
	{
		code: 6033,
		name: "EndTimeBeforeStartTime"
	},
	{
		code: 6034,
		name: "TimeRangeTooLarge"
	},
	{
		code: 6035,
		name: "EndTimeBeforeCurrentDay"
	},
	{
		code: 6036,
		name: "SupplyUpdateForFinishedRange"
	},
	{
		code: 6037,
		name: "DayIndexAfterEndIndex"
	},
	{
		code: 6038,
		name: "DayInActiveRange"
	},
	{
		code: 6039,
		name: "InvalidIncentiveMint"
	}
];
var types = [
	{
		name: "AdminSetCreatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "admin_set_creator_authority",
					type: "pubkey"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "old_creator",
					type: "pubkey"
				},
				{
					name: "new_creator",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "AdminSetIdlAuthorityEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "idl_authority",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "AdminUpdateTokenIncentivesEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "start_time",
					type: "i64"
				},
				{
					name: "end_time",
					type: "i64"
				},
				{
					name: "day_number",
					type: "u64"
				},
				{
					name: "token_supply_per_day",
					type: "u64"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "seconds_in_a_day",
					type: "i64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "BondingCurve",
		type: {
			kind: "struct",
			fields: [
				{
					name: "virtual_token_reserves",
					type: "u64"
				},
				{
					name: "virtual_sol_reserves",
					type: "u64"
				},
				{
					name: "real_token_reserves",
					type: "u64"
				},
				{
					name: "real_sol_reserves",
					type: "u64"
				},
				{
					name: "token_total_supply",
					type: "u64"
				},
				{
					name: "complete",
					type: "bool"
				},
				{
					name: "creator",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "ClaimTokenIncentivesEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "amount",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CloseUserVolumeAccumulatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CollectCreatorFeeEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "creator",
					type: "pubkey"
				},
				{
					name: "creator_fee",
					type: "u64"
				}
			]
		}
	},
	{
		name: "CompleteEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "CompletePumpAmmMigrationEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "mint_amount",
					type: "u64"
				},
				{
					name: "sol_amount",
					type: "u64"
				},
				{
					name: "pool_migration_fee",
					type: "u64"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "pool",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "CreateEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "name",
					type: "string"
				},
				{
					name: "symbol",
					type: "string"
				},
				{
					name: "uri",
					type: "string"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "creator",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "virtual_token_reserves",
					type: "u64"
				},
				{
					name: "virtual_sol_reserves",
					type: "u64"
				},
				{
					name: "real_token_reserves",
					type: "u64"
				},
				{
					name: "token_total_supply",
					type: "u64"
				}
			]
		}
	},
	{
		name: "ExtendAccountEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "account",
					type: "pubkey"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "current_size",
					type: "u64"
				},
				{
					name: "new_size",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "FeeConfig",
		type: {
			kind: "struct",
			fields: [
				{
					name: "bump",
					type: "u8"
				},
				{
					name: "admin",
					type: "pubkey"
				},
				{
					name: "flat_fees",
					type: {
						defined: {
							name: "Fees"
						}
					}
				},
				{
					name: "fee_tiers",
					type: {
						vec: {
							defined: {
								name: "FeeTier"
							}
						}
					}
				}
			]
		}
	},
	{
		name: "FeeTier",
		type: {
			kind: "struct",
			fields: [
				{
					name: "market_cap_lamports_threshold",
					type: "u128"
				},
				{
					name: "fees",
					type: {
						defined: {
							name: "Fees"
						}
					}
				}
			]
		}
	},
	{
		name: "Fees",
		type: {
			kind: "struct",
			fields: [
				{
					name: "lp_fee_bps",
					type: "u64"
				},
				{
					name: "protocol_fee_bps",
					type: "u64"
				},
				{
					name: "creator_fee_bps",
					type: "u64"
				}
			]
		}
	},
	{
		name: "Global",
		type: {
			kind: "struct",
			fields: [
				{
					name: "initialized",
					docs: [
						"Unused"
					],
					type: "bool"
				},
				{
					name: "authority",
					type: "pubkey"
				},
				{
					name: "fee_recipient",
					type: "pubkey"
				},
				{
					name: "initial_virtual_token_reserves",
					type: "u64"
				},
				{
					name: "initial_virtual_sol_reserves",
					type: "u64"
				},
				{
					name: "initial_real_token_reserves",
					type: "u64"
				},
				{
					name: "token_total_supply",
					type: "u64"
				},
				{
					name: "fee_basis_points",
					type: "u64"
				},
				{
					name: "withdraw_authority",
					type: "pubkey"
				},
				{
					name: "enable_migrate",
					docs: [
						"Unused"
					],
					type: "bool"
				},
				{
					name: "pool_migration_fee",
					type: "u64"
				},
				{
					name: "creator_fee_basis_points",
					type: "u64"
				},
				{
					name: "fee_recipients",
					type: {
						array: [
							"pubkey",
							7
						]
					}
				},
				{
					name: "set_creator_authority",
					type: "pubkey"
				},
				{
					name: "admin_set_creator_authority",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "GlobalVolumeAccumulator",
		type: {
			kind: "struct",
			fields: [
				{
					name: "start_time",
					type: "i64"
				},
				{
					name: "end_time",
					type: "i64"
				},
				{
					name: "seconds_in_a_day",
					type: "i64"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "total_token_supply",
					type: {
						array: [
							"u64",
							30
						]
					}
				},
				{
					name: "sol_volumes",
					type: {
						array: [
							"u64",
							30
						]
					}
				}
			]
		}
	},
	{
		name: "InitUserVolumeAccumulatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "payer",
					type: "pubkey"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "SetCreatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "creator",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "SetMetaplexCreatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "bonding_curve",
					type: "pubkey"
				},
				{
					name: "metadata",
					type: "pubkey"
				},
				{
					name: "creator",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "SetParamsEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "initial_virtual_token_reserves",
					type: "u64"
				},
				{
					name: "initial_virtual_sol_reserves",
					type: "u64"
				},
				{
					name: "initial_real_token_reserves",
					type: "u64"
				},
				{
					name: "final_real_sol_reserves",
					type: "u64"
				},
				{
					name: "token_total_supply",
					type: "u64"
				},
				{
					name: "fee_basis_points",
					type: "u64"
				},
				{
					name: "withdraw_authority",
					type: "pubkey"
				},
				{
					name: "enable_migrate",
					type: "bool"
				},
				{
					name: "pool_migration_fee",
					type: "u64"
				},
				{
					name: "creator_fee_basis_points",
					type: "u64"
				},
				{
					name: "fee_recipients",
					type: {
						array: [
							"pubkey",
							8
						]
					}
				},
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "set_creator_authority",
					type: "pubkey"
				},
				{
					name: "admin_set_creator_authority",
					type: "pubkey"
				}
			]
		}
	},
	{
		name: "SyncUserVolumeAccumulatorEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "total_claimed_tokens_before",
					type: "u64"
				},
				{
					name: "total_claimed_tokens_after",
					type: "u64"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "TradeEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "mint",
					type: "pubkey"
				},
				{
					name: "sol_amount",
					type: "u64"
				},
				{
					name: "token_amount",
					type: "u64"
				},
				{
					name: "is_buy",
					type: "bool"
				},
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				},
				{
					name: "virtual_sol_reserves",
					type: "u64"
				},
				{
					name: "virtual_token_reserves",
					type: "u64"
				},
				{
					name: "real_sol_reserves",
					type: "u64"
				},
				{
					name: "real_token_reserves",
					type: "u64"
				},
				{
					name: "fee_recipient",
					type: "pubkey"
				},
				{
					name: "fee_basis_points",
					type: "u64"
				},
				{
					name: "fee",
					type: "u64"
				},
				{
					name: "creator",
					type: "pubkey"
				},
				{
					name: "creator_fee_basis_points",
					type: "u64"
				},
				{
					name: "creator_fee",
					type: "u64"
				}
			]
		}
	},
	{
		name: "UpdateGlobalAuthorityEvent",
		type: {
			kind: "struct",
			fields: [
				{
					name: "global",
					type: "pubkey"
				},
				{
					name: "authority",
					type: "pubkey"
				},
				{
					name: "new_authority",
					type: "pubkey"
				},
				{
					name: "timestamp",
					type: "i64"
				}
			]
		}
	},
	{
		name: "UserVolumeAccumulator",
		type: {
			kind: "struct",
			fields: [
				{
					name: "user",
					type: "pubkey"
				},
				{
					name: "needs_claim",
					type: "bool"
				},
				{
					name: "total_unclaimed_tokens",
					type: "u64"
				},
				{
					name: "total_claimed_tokens",
					type: "u64"
				},
				{
					name: "current_sol_volume",
					type: "u64"
				},
				{
					name: "last_update_timestamp",
					type: "i64"
				},
				{
					name: "has_total_claimed_tokens",
					type: "bool"
				}
			]
		}
	}
];
var IDL = {
	address: address,
	metadata: metadata,
	instructions: instructions,
	accounts: accounts,
	events: events,
	errors: errors,
	types: types
};

const toPubKey = (v) => new PublicKey(v);
const toBigInt = (v) => BigInt(v);

function toCollectCreatorFeeEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        creator: toPubKey(e.creator),
        creatorFee: toBigInt(e.creatorFee),
    };
}
function toCompleteEvent(e) {
    return {
        user: toPubKey(e.user),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
    };
}
function toCompletePumpAmmMigrationEvent(e) {
    return {
        user: toPubKey(e.user),
        mint: toPubKey(e.mint),
        mintAmount: toBigInt(e.mintAmount),
        solAmount: toBigInt(e.solAmount),
        poolMigrationFee: toBigInt(e.poolMigrationFee),
        bondingCurve: toPubKey(e.bondingCurve),
        timestamp: Number(e.timestamp),
        pool: toPubKey(e.pool),
    };
}
function toCreateEvent(e) {
    return {
        name: e.name,
        symbol: e.symbol,
        uri: e.uri,
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        user: toPubKey(e.user),
        creator: toPubKey(e.creator),
        timestamp: Number(e.timestamp),
        virtualTokenReserves: toBigInt(e.virtualTokenReserves),
        virtualSolReserves: toBigInt(e.virtualSolReserves),
        realTokenReserves: toBigInt(e.realTokenReserves),
        tokenTotalSupply: toBigInt(e.tokenTotalSupply),
    };
}
function toExtendAccountEvent(e) {
    return {
        account: toPubKey(e.account),
        user: toPubKey(e.user),
        currentSize: toBigInt(e.currentSize),
        newSize: toBigInt(e.newSize),
        timestamp: Number(e.timestamp),
    };
}
function toSetCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        creator: toPubKey(e.creator),
    };
}
function toSetMetaplexCreatorEvent(e) {
    return {
        timestamp: Number(e.timestamp),
        mint: toPubKey(e.mint),
        bondingCurve: toPubKey(e.bondingCurve),
        metadata: toPubKey(e.metadata),
        creator: toPubKey(e.creator),
    };
}
function toSetParamsEvent(e) {
    return {
        initialVirtualTokenReserves: toBigInt(e.initialVirtualTokenReserves),
        initialVirtualSolReserves: toBigInt(e.initialVirtualSolReserves),
        initialRealTokenReserves: toBigInt(e.initialRealTokenReserves),
        finalRealSolReserves: toBigInt(e.finalRealSolReserves),
        tokenTotalSupply: toBigInt(e.tokenTotalSupply),
        feeBasisPoints: toBigInt(e.feeBasisPoints),
        withdrawAuthority: toPubKey(e.withdrawAuthority),
        enableMigrate: Boolean(e.enableMigrate),
        poolMigrationFee: toBigInt(e.poolMigrationFee),
        creatorFeeBasisPoints: toBigInt(e.creatorFeeBasisPoints),
        feeRecipients: e.feeRecipients.map(toPubKey),
        timestamp: Number(e.timestamp),
        setCreatorAuthority: toPubKey(e.setCreatorAuthority),
    };
}
function toTradeEvent(e) {
    return {
        mint: toPubKey(e.mint),
        solAmount: toBigInt(e.solAmount),
        tokenAmount: toBigInt(e.tokenAmount),
        isBuy: Boolean(e.isBuy),
        user: toPubKey(e.user),
        timestamp: Number(e.timestamp),
        virtualSolReserves: toBigInt(e.virtualSolReserves),
        virtualTokenReserves: toBigInt(e.virtualTokenReserves),
        realSolReserves: toBigInt(e.realSolReserves),
        realTokenReserves: toBigInt(e.realTokenReserves),
        feeRecipient: toPubKey(e.feeRecipient),
        feeBasisPoints: toBigInt(e.feeBasisPoints),
        fee: toBigInt(e.fee),
        creator: toPubKey(e.creator),
        creatorFeeBasisPoints: toBigInt(e.creatorFeeBasisPoints),
        creatorFee: toBigInt(e.creatorFee),
    };
}
function toUpdateGlobalAuthorityEvent(e) {
    return {
        global: toPubKey(e.global),
        authority: toPubKey(e.authority),
        newAuthority: toPubKey(e.newAuthority),
        timestamp: Number(e.timestamp),
    };
}

const converters = {
    createEvent: toCreateEvent,
    tradeEvent: toTradeEvent,
    completeEvent: toCompleteEvent,
    setParamsEvent: toSetParamsEvent,
    collectCreatorFeeEvent: toCollectCreatorFeeEvent,
    completePumpAmmMigrationEvent: toCompletePumpAmmMigrationEvent,
    extendAccountEvent: toExtendAccountEvent,
    setCreatorEvent: toSetCreatorEvent,
    setMetaplexCreatorEvent: toSetMetaplexCreatorEvent,
    updateGlobalAuthorityEvent: toUpdateGlobalAuthorityEvent,
};

class EventModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    addEventListener(eventType, callback) {
        return this.sdk.program.addEventListener(eventType, (event, slot, signature) => {
            try {
                const convert = converters[eventType];
                if (!convert)
                    throw new Error(`No converter for event type: ${eventType}`);
                callback(convert(event), slot, signature);
            }
            catch (err) {
                console.error(`Failed to handle ${eventType}:`, err);
            }
        });
    }
    removeEventListener(id) {
        this.sdk.program.removeEventListener(id);
    }
}

var Region;
(function (Region) {
    Region["Frankfurt"] = "fra";
    Region["NY"] = "ny";
    Region["Tokyo"] = "tokyo";
    Region["Amsterdam"] = "ams";
    Region["LosAngeles"] = "la";
})(Region || (Region = {}));

const MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const GLOBAL_ACCOUNT_SEED = "global";
const MINT_AUTHORITY_SEED = "mint-authority";
const BONDING_CURVE_SEED = "bonding-curve";
const METADATA_SEED = "metadata";
const EVENT_AUTHORITY_SEED = "__event_authority";
const GLOBAL_VOLUME_SEED = "global_volume_accumulator";
const USER_VOLUME_SEED = "user_volume_accumulator";
// Mayhem mode constants (Breaking change Nov 11, 2025)
const MAYHEM_PROGRAM_ID = new PublicKey("MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e");
const MAYHEM_FEE_RECIPIENT = new PublicKey("GesfTA3X2arioaHp8bbKdjG9vJtskViWACZoYvxp4twS");
const MAYHEM_STATE_SEED = "mayhem-state";
const GLOBAL_PARAMS_SEED = "global-params";
const SOL_VAULT_SEED = "sol-vault";
// Token program constants
const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const LEGACY_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const PUMP_PROGRAM_ID = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
const PUMP_FEE_PROGRAM_ID = new PublicKey("pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ");
const DEFAULT_DECIMALS = 6;
const DEFAULT_COMMITMENT = "finalized";
const DEFAULT_FINALITY = "finalized";
const SLOT_ENDPOINT_BY_REGION = {
    [Region.Frankfurt]: "de1.0slot.trade",
    [Region.NY]: "ny1.0slot.trade",
    [Region.Tokyo]: "jp.0slot.trade",
    [Region.Amsterdam]: "ams1.0slot.trade",
    [Region.LosAngeles]: "la1.0slot.trade",
};
const ASTRA_ENDPOINT_BY_REGION = {
    [Region.Frankfurt]: "fr.gateway.astralane.io",
    [Region.NY]: "ny.gateway.astralane.io",
    [Region.Tokyo]: "jp.gateway.astralane.io",
    [Region.Amsterdam]: "ams.gateway.astralane.io",
};
const NODE1_ENDPOINT_BY_REGION = {
    [Region.NY]: "ny.node1.me",
    [Region.Tokyo]: "ny.node1.me",
    [Region.Amsterdam]: "ams.node1.me",
    [Region.Frankfurt]: "fra.node1.me",
};
const NEXTBLOCK_ENDPOINT_BY_REGION = {
    [Region.Tokyo]: "tokyo.nextblock.io",
    [Region.Frankfurt]: "fra.nextblock.io",
    [Region.NY]: "ny.nextblock.io",
};
const getHealthBody = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "getHealth",
});

class BondingCurveAccount {
    discriminator;
    virtualTokenReserves;
    virtualSolReserves;
    realTokenReserves;
    realSolReserves;
    tokenTotalSupply;
    complete;
    creator;
    isMayhemMode;
    constructor(discriminator, virtualTokenReserves, virtualSolReserves, realTokenReserves, realSolReserves, tokenTotalSupply, complete, creator, isMayhemMode = false) {
        this.discriminator = discriminator;
        this.virtualTokenReserves = virtualTokenReserves;
        this.virtualSolReserves = virtualSolReserves;
        this.realTokenReserves = realTokenReserves;
        this.realSolReserves = realSolReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.complete = complete;
        this.creator = creator;
        this.isMayhemMode = isMayhemMode;
    }
    getBuyPrice(globalAccount, feeConfig, amount) {
        if (this.complete) {
            throw new Error("Curve is complete");
        }
        if (amount <= 0n) {
            return 0n;
        }
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        const { protocolFeeBps, creatorFeeBps } = feeConfig.computeFeesBps({
            global: globalAccount,
            virtualSolReserves: this.virtualSolReserves,
            virtualTokenReserves: this.virtualTokenReserves,
        });
        const totalFeeBasisPoints = protocolFeeBps +
            (!PublicKey.default.equals(this.creator) ? creatorFeeBps : 0n);
        const inputAmount = (amount * 10000n) / (totalFeeBasisPoints + 10000n);
        const tokensReceived = this.getBuyTokenAmountFromSolAmountQuote({
            inputAmount,
            virtualTokenReserves: this.virtualTokenReserves,
            virtualSolReserves: this.virtualSolReserves,
        });
        return tokensReceived < this.realTokenReserves
            ? tokensReceived
            : this.realTokenReserves;
    }
    getBuyTokenAmountFromSolAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }) {
        return ((inputAmount * virtualTokenReserves) / (virtualSolReserves + inputAmount));
    }
    getSellSolAmountFromTokenAmountQuote({ inputAmount, virtualTokenReserves, virtualSolReserves, }) {
        return ((inputAmount * virtualSolReserves) / (virtualTokenReserves + inputAmount));
    }
    getSellPrice(globalAccount, feeConfig, amount) {
        if (this.complete) {
            throw new Error("Curve is complete");
        }
        if (amount <= 0n) {
            return 0n;
        }
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        const solCost = this.getSellSolAmountFromTokenAmountQuote({
            inputAmount: amount,
            virtualTokenReserves: this.virtualTokenReserves,
            virtualSolReserves: this.virtualSolReserves,
        });
        const fee = feeConfig.getFee({
            global: globalAccount,
            bondingCurve: this,
            amount: solCost,
            isNewBondingCurve: false,
        });
        return solCost - fee;
    }
    getMarketCapSOL() {
        if (this.virtualTokenReserves === 0n) {
            return 0n;
        }
        return ((this.tokenTotalSupply * this.virtualSolReserves) /
            this.virtualTokenReserves);
    }
    getFinalMarketCapSOL(mintSupply) {
        return (this.virtualSolReserves * mintSupply) / this.virtualTokenReserves;
    }
    static fromBuffer(buffer) {
        // The BondingCurve account has been expanded beyond the original 81/82 bytes
        // We only need to read the first 81 or 82 bytes for the fields we care about
        const minOldSize = 81; // 8 u64s + 1 bool + 32-byte pubkey = 73 bytes
        const minNewSize = 82; // + 1 bool for isMayhemMode
        if (buffer.length < minOldSize) {
            throw new Error(`Invalid BondingCurveAccount buffer size: ${buffer.length} (expected at least ${minOldSize})`);
        }
        // Check if we have the mayhem mode field by looking at available data
        const hasNewFields = buffer.length >= minNewSize;
        // Use appropriate structure based on available data
        const structure = hasNewFields
            ? struct([
                u64("discriminator"),
                u64("virtualTokenReserves"),
                u64("virtualSolReserves"),
                u64("realTokenReserves"),
                u64("realSolReserves"),
                u64("tokenTotalSupply"),
                bool("complete"),
                publicKey("creator"),
                bool("isMayhemMode"),
            ])
            : struct([
                u64("discriminator"),
                u64("virtualTokenReserves"),
                u64("virtualSolReserves"),
                u64("realTokenReserves"),
                u64("realSolReserves"),
                u64("tokenTotalSupply"),
                bool("complete"),
                publicKey("creator"),
            ]);
        // Only decode the bytes we need (first 81 or 82 bytes)
        const bytesToDecode = hasNewFields ? minNewSize : minOldSize;
        let value = structure.decode(buffer.subarray(0, bytesToDecode));
        return new BondingCurveAccount(BigInt(value.discriminator), BigInt(value.virtualTokenReserves), BigInt(value.virtualSolReserves), BigInt(value.realTokenReserves), BigInt(value.realSolReserves), BigInt(value.tokenTotalSupply), value.complete, value.creator, hasNewFields ? value.isMayhemMode : false);
    }
}

class GlobalAccount {
    discriminator;
    initialized = false;
    authority;
    feeRecipient;
    initialVirtualTokenReserves;
    initialVirtualSolReserves;
    initialRealTokenReserves;
    tokenTotalSupply;
    feeBasisPoints;
    withdrawAuthority;
    enableMigrate = false;
    poolMigrationFee;
    creatorFeeBasisPoints;
    reservedFeeRecipient;
    mayhemModeEnabled = false;
    constructor(discriminator, initialized, authority, feeRecipient, initialVirtualTokenReserves, initialVirtualSolReserves, initialRealTokenReserves, tokenTotalSupply, feeBasisPoints, withdrawAuthority, enableMigrate, poolMigrationFee, creatorFeeBasisPoints, reservedFeeRecipient, mayhemModeEnabled = false) {
        this.discriminator = discriminator;
        this.initialized = initialized;
        this.authority = authority;
        this.feeRecipient = feeRecipient;
        this.initialVirtualTokenReserves = initialVirtualTokenReserves;
        this.initialVirtualSolReserves = initialVirtualSolReserves;
        this.initialRealTokenReserves = initialRealTokenReserves;
        this.tokenTotalSupply = tokenTotalSupply;
        this.feeBasisPoints = feeBasisPoints;
        this.withdrawAuthority = withdrawAuthority;
        this.enableMigrate = enableMigrate;
        this.poolMigrationFee = poolMigrationFee;
        this.creatorFeeBasisPoints = creatorFeeBasisPoints;
        this.reservedFeeRecipient = reservedFeeRecipient || PublicKey.default;
        this.mayhemModeEnabled = mayhemModeEnabled;
    }
    getInitialBuyPrice(amount) {
        if (amount <= 0n) {
            return 0n;
        }
        let n = this.initialVirtualSolReserves * this.initialVirtualTokenReserves;
        let i = this.initialVirtualSolReserves + amount;
        let r = n / i + 1n;
        let s = this.initialVirtualTokenReserves - r;
        return s < this.initialRealTokenReserves
            ? s
            : this.initialRealTokenReserves;
    }
    static fromBuffer(buffer) {
        // The Global account has been expanded significantly beyond the original 243/244 bytes
        // We only need to read the first 243 or 244 bytes for the fields we care about
        const minOldSize = 243;
        const minNewSize = 244;
        if (buffer.length < minOldSize) {
            throw new Error(`Invalid GlobalAccount buffer size: ${buffer.length} (expected at least ${minOldSize})`);
        }
        // Check if we have the new fields by looking at byte 243
        const hasNewFields = buffer.length >= minNewSize;
        // Use appropriate structure based on available data
        const structure = hasNewFields
            ? struct([
                u64("discriminator"),
                bool("initialized"),
                publicKey("authority"),
                publicKey("feeRecipient"),
                u64("initialVirtualTokenReserves"),
                u64("initialVirtualSolReserves"),
                u64("initialRealTokenReserves"),
                u64("tokenTotalSupply"),
                u64("feeBasisPoints"),
                publicKey("withdrawAuthority"),
                bool("enableMigrate"),
                u64("poolMigrationFee"),
                u64("creatorFeeBasisPoints"),
                publicKey("reservedFeeRecipient"),
                bool("mayhemModeEnabled"),
            ])
            : struct([
                u64("discriminator"),
                bool("initialized"),
                publicKey("authority"),
                publicKey("feeRecipient"),
                u64("initialVirtualTokenReserves"),
                u64("initialVirtualSolReserves"),
                u64("initialRealTokenReserves"),
                u64("tokenTotalSupply"),
                u64("feeBasisPoints"),
                publicKey("withdrawAuthority"),
                bool("enableMigrate"),
                u64("poolMigrationFee"),
                u64("creatorFeeBasisPoints"),
            ]);
        // Only decode the bytes we need (first 243 or 244 bytes)
        const bytesToDecode = hasNewFields ? minNewSize : minOldSize;
        let value = structure.decode(buffer.subarray(0, bytesToDecode));
        return new GlobalAccount(BigInt(value.discriminator), value.initialized, value.authority, value.feeRecipient, BigInt(value.initialVirtualTokenReserves), BigInt(value.initialVirtualSolReserves), BigInt(value.initialRealTokenReserves), BigInt(value.tokenTotalSupply), BigInt(value.feeBasisPoints), value.withdrawAuthority, value.enableMigrate, BigInt(value.poolMigrationFee), BigInt(value.creatorFeeBasisPoints), hasNewFields ? value.reservedFeeRecipient : PublicKey.default, hasNewFields ? value.mayhemModeEnabled : false);
    }
}

class FeeConfig {
    discriminator;
    admin;
    flatFees;
    feeTiers;
    constructor(discriminator, admin, flatFees, feeTiers) {
        this.discriminator = discriminator;
        this.admin = admin;
        this.flatFees = flatFees;
        this.feeTiers = feeTiers;
    }
    getFee({ global, bondingCurve, amount, isNewBondingCurve, }) {
        const { virtualSolReserves, virtualTokenReserves } = bondingCurve;
        const { protocolFeeBps, creatorFeeBps } = this.computeFeesBps({
            global,
            virtualSolReserves,
            virtualTokenReserves,
        });
        return (this.fee(amount, protocolFeeBps) +
            (isNewBondingCurve || !PublicKey.default.equals(bondingCurve.creator)
                ? this.fee(amount, creatorFeeBps)
                : 0n));
    }
    bondingCurveMarketCap({ mintSupply, virtualSolReserves, virtualTokenReserves, }) {
        if (virtualTokenReserves === 0n) {
            throw new Error("Division by zero: virtual token reserves cannot be zero");
        }
        return (virtualSolReserves * mintSupply) / virtualTokenReserves;
    }
    computeFeesBps({ global, virtualSolReserves, virtualTokenReserves, }) {
        const marketCap = this.bondingCurveMarketCap({
            mintSupply: global.tokenTotalSupply,
            virtualSolReserves,
            virtualTokenReserves,
        });
        return this.calculateFeeTier({
            feeTiers: this.feeTiers,
            marketCap,
        });
    }
    calculateFeeTier({ feeTiers, marketCap, }) {
        const firstTier = feeTiers[0];
        if (marketCap < firstTier.marketCapLamportsThreshold) {
            return firstTier.fees;
        }
        for (const tier of feeTiers.slice().reverse()) {
            if (marketCap >= tier.marketCapLamportsThreshold) {
                return tier.fees;
            }
        }
        return firstTier.fees;
    }
    fee(amount, feeBasisPoints) {
        return this.ceilDiv(amount * feeBasisPoints, 10000n);
    }
    ceilDiv(a, b) {
        return (a + (b - 1n)) / b;
    }
    static convert(base) {
        const flatFees = {
            lpFeeBps: BigInt(base.flatFees.lpFeeBps.toString()),
            protocolFeeBps: BigInt(base.flatFees.protocolFeeBps.toString()),
            creatorFeeBps: BigInt(base.flatFees.creatorFeeBps.toString()),
        };
        const feeTiers = base.feeTiers.map((tier) => ({
            marketCapLamportsThreshold: BigInt(tier.marketCapLamportsThreshold.toString()),
            fees: {
                lpFeeBps: BigInt(tier.fees.lpFeeBps.toString()),
                protocolFeeBps: BigInt(tier.fees.protocolFeeBps.toString()),
                creatorFeeBps: BigInt(tier.fees.creatorFeeBps.toString()),
            },
        }));
        return new FeeConfig(0n, // discriminator not available in FeeConfigAnchor
        base.admin, flatFees, feeTiers);
    }
}

class TokenModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    async createTokenMetadata(create) {
        // Validate file
        if (!(create.file instanceof Blob)) {
            throw new Error("File must be a Blob or File object");
        }
        let formData = new FormData();
        formData.append("file", create.file, "image.png"); // Add filename
        formData.append("name", create.name);
        formData.append("symbol", create.symbol);
        formData.append("description", create.description);
        formData.append("twitter", create.twitter || "");
        formData.append("telegram", create.telegram || "");
        formData.append("website", create.website || "");
        formData.append("showName", "true");
        try {
            const request = await fetch("https://pump.fun/api/ipfs", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
                credentials: "same-origin",
            });
            if (request.status === 500) {
                // Try to get more error details
                const errorText = await request.text();
                throw new Error(`Server error (500): ${errorText || "No error details available"}`);
            }
            if (!request.ok) {
                throw new Error(`HTTP error! status: ${request.status}`);
            }
            const responseText = await request.text();
            if (!responseText) {
                throw new Error("Empty response received from server");
            }
            try {
                return JSON.parse(responseText);
            }
            catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        }
        catch (error) {
            console.error("Error in createTokenMetadata:", error);
            throw error;
        }
    }
    async createAssociatedTokenAccountIfNeeded(payer, owner, mint, transaction, commitment = DEFAULT_COMMITMENT) {
        const associatedTokenAccount = await getAssociatedTokenAddress(mint, owner, false);
        try {
            await getAccount(this.sdk.connection, associatedTokenAccount, commitment);
        }
        catch (e) {
            transaction.add(createAssociatedTokenAccountInstruction(payer, associatedTokenAccount, owner, mint));
        }
        return associatedTokenAccount;
    }
    async getBondingCurveAccount(mint, commitment = DEFAULT_COMMITMENT) {
        const tokenAccount = await this.sdk.connection.getAccountInfo(this.sdk.pda.getBondingCurvePDA(mint), commitment);
        if (!tokenAccount) {
            return null;
        }
        // Skip 8-byte Anchor discriminator
        const accountData = tokenAccount.data.subarray(8);
        return BondingCurveAccount.fromBuffer(accountData);
    }
    async getGlobalAccount(commitment = DEFAULT_COMMITMENT) {
        const globalAccountPDA = this.sdk.pda.getGlobalAccountPda();
        const tokenAccount = await this.sdk.connection.getAccountInfo(globalAccountPDA, commitment);
        // Skip 8-byte Anchor discriminator
        const accountData = tokenAccount.data.subarray(8);
        return GlobalAccount.fromBuffer(accountData);
    }
    async getFeeConfig(commitment = DEFAULT_COMMITMENT) {
        const feePda = this.sdk.pda.getPumpFeeConfigPda();
        // @ts-ignore: feeConfig account is missing in generated Anchor types
        const anchorFee = await this.sdk.program.account.feeConfig.fetch(feePda);
        return FeeConfig.convert(anchorFee);
    }
    async getBondingCurveCreator(bondingCurvePDA, commitment = DEFAULT_COMMITMENT) {
        const bondingAccountInfo = await this.sdk.connection.getAccountInfo(bondingCurvePDA, commitment);
        if (!bondingAccountInfo) {
            throw new Error("Bonding curve account not found");
        }
        // Creator is at offset 49 (after 8 bytes discriminator, 5 u64 fields, and 1 byte boolean)
        const creatorBytes = bondingAccountInfo.data.subarray(49, 49 + 32);
        return new PublicKey(creatorBytes);
    }
}

const calculateWithSlippageBuy = (amount, basisPoints) => {
    return amount + (amount * basisPoints) / 10000n;
};
function calculateWithSlippageSell(amount, slippageBasisPoints = 500n) {
    // Actually use the slippage basis points for calculation
    const reduction = Math.max(1, Number((amount * slippageBasisPoints) / 10000n));
    return amount - BigInt(reduction);
}

async function sendTx(connection, tx, payer, signers, priorityFees, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) {
    let versionedTx = await buildSignedTx(priorityFees, tx, connection, payer, commitment, signers);
    try {
        const sig = await connection.sendTransaction(versionedTx, {
            skipPreflight: false,
        });
        console.log("sig:", `https://solscan.io/tx/${sig}`);
        let txResult = await getTxDetails(connection, sig, commitment, finality);
        if (!txResult) {
            return {
                success: false,
                error: "Transaction failed",
            };
        }
        return {
            success: true,
            signature: sig,
            results: txResult,
        };
    }
    catch (e) {
        if (e instanceof SendTransactionError) {
            let ste = e;
            console.log("SendTransactionError" + ste.logs);
        }
        else {
            console.error(e);
        }
        return {
            error: e,
            success: false,
        };
    }
}
const buildVersionedTx = async (connection, payer, tx, commitment = DEFAULT_COMMITMENT) => {
    const blockHash = (await connection.getLatestBlockhash(commitment)).blockhash;
    let messageV0 = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockHash,
        instructions: tx.instructions,
    }).compileToV0Message();
    return new VersionedTransaction(messageV0);
};
const getTxDetails = async (connection, sig, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) => {
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: sig,
    }, commitment);
    return connection.getTransaction(sig, {
        maxSupportedTransactionVersion: 0,
        commitment: finality,
    });
};
async function buildSignedTx(priorityFees, tx, connection, payer, commitment, signers) {
    let newTx = new Transaction();
    if (priorityFees) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: priorityFees.unitLimit,
        });
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: priorityFees.unitPrice,
        });
        newTx.add(modifyComputeUnits);
        newTx.add(addPriorityFee);
    }
    newTx.add(tx);
    let versionedTx = await buildVersionedTx(connection, payer, newTx, commitment);
    versionedTx.sign(signers);
    return versionedTx;
}

class TradeModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    async createAndBuy(creator, mint, metadata, buyAmountSol, slippageBasisPoints = 500n, priorityFees, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) {
        const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);
        const createIx = await this.getCreateInstructions(creator.publicKey, metadata.name, metadata.symbol, tokenMetadata.metadataUri, mint);
        const transaction = new Transaction().add(createIx);
        if (buyAmountSol > 0n) {
            const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
            const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
            const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
            await this.buildBuyIx(creator.publicKey, mint.publicKey, buyAmount, buyAmountWithSlippage, transaction, commitment, true);
        }
        return await sendTx(this.sdk.connection, transaction, creator.publicKey, [creator, mint], priorityFees, commitment, finality);
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, priorityFees, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        return await sendTx(this.sdk.connection, transaction, buyer.publicKey, [buyer], priorityFees, commitment, finality);
    }
    async getBuyInstructionsBySolAmount(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, commitment = DEFAULT_COMMITMENT) {
        const bondingCurveAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingCurveAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingCurveAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.buildBuyIx(buyer, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        return transaction;
    }
    async buildBuyIx(buyer, mint, amount, maxSolCost, tx, commitment, shouldUseBuyerAsBonding) {
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
        const associatedBonding = await getAssociatedTokenAddress(mint, bondingCurve, true);
        const associatedUser = await this.sdk.token.createAssociatedTokenAccountIfNeeded(buyer, buyer, mint, tx, commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const globalAccountPDA = this.sdk.pda.getGlobalAccountPda();
        const bondingCreator = shouldUseBuyerAsBonding
            ? this.sdk.pda.getCreatorVaultPda(buyer)
            : await this.sdk.token.getBondingCurveCreator(bondingCurve, commitment);
        const creatorVault = shouldUseBuyerAsBonding
            ? bondingCreator
            : this.sdk.pda.getCreatorVaultPda(bondingCreator);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .buy(new BN(amount.toString()), new BN(maxSolCost.toString()))
            .accounts({
            global: globalAccountPDA,
            feeRecipient: globalAccount.feeRecipient,
            mint,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            associatedUser,
            user: buyer,
            creatorVault,
            eventAuthority,
            globalVolumeAccumulator: this.sdk.pda.getGlobalVolumeAccumulatorPda(),
            userVolumeAccumulator: this.sdk.pda.getUserVolumeAccumulatorPda(buyer),
            feeConfig: this.sdk.pda.getPumpFeeConfigPda(),
        })
            .instruction();
        tx.add(ix);
    }
    //create token instructions (legacy - uses Metaplex metadata)
    async getCreateInstructions(creator, name, symbol, uri, mint) {
        const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
        const associatedBonding = await getAssociatedTokenAddress(mint.publicKey, bondingCurve, true);
        const global = this.sdk.pda.getGlobalAccountPda();
        const metadata = this.sdk.pda.getMetadataPDA(mint.publicKey);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .create(name, symbol, uri, creator)
            .accounts({
            mint: mint.publicKey,
            mintAuthority,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            global,
            metadata,
            user: creator,
            eventAuthority,
        })
            .instruction();
        return new Transaction().add(ix);
    }
    /**
     * Create token instructions using Token2022 and mayhem mode support
     * Breaking change introduced Nov 11, 2025
     * @param creator Creator public key
     * @param name Token name
     * @param symbol Token symbol
     * @param uri Metadata URI
     * @param mint Mint keypair
     * @param isMayhemMode Enable mayhem mode (uses different fee recipient)
     * @returns Transaction with createV2 instruction
     */
    async getCreateV2Instructions(creator, name, symbol, uri, mint, isMayhemMode = false) {
        const mintAuthority = this.sdk.pda.getMintAuthorityPDA();
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint.publicKey);
        // Use Token2022 for associated token account
        const associatedBonding = await getAssociatedTokenAddress(mint.publicKey, bondingCurve, true, TOKEN_2022_PROGRAM_ID$1);
        const global = this.sdk.pda.getGlobalAccountPda();
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        // Mayhem mode accounts (indices 10-14)
        const mayhemProgramId = MAYHEM_PROGRAM_ID;
        const globalParams = this.sdk.pda.getGlobalParamsPda();
        const solVault = this.sdk.pda.getSolVaultPda();
        const mayhemState = this.sdk.pda.getMayhemStatePda(mint.publicKey);
        const mayhemTokenVault = this.sdk.pda.getMayhemTokenVaultPda(mint.publicKey);
        const ix = await this.sdk.program.methods
            .createV2(name, symbol, uri, creator, isMayhemMode)
            .accounts({
            mint: mint.publicKey,
            mintAuthority,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            global,
            user: creator,
            systemProgram: PublicKey.default, // Will be set by Anchor
            tokenProgram: TOKEN_2022_PROGRAM_ID$1,
            associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
            mayhemProgramId,
            globalParams,
            solVault,
            mayhemState,
            mayhemTokenVault,
            eventAuthority,
        })
            .instruction();
        return new Transaction().add(ix);
    }
    /**
     * Create and buy using Token2022 with optional mayhem mode
     * @param creator Creator keypair
     * @param mint Mint keypair
     * @param metadata Token metadata
     * @param buyAmountSol Amount of SOL to spend on initial buy
     * @param isMayhemMode Enable mayhem mode
     * @param slippageBasisPoints Slippage tolerance in basis points
     * @param priorityFees Priority fees configuration
     * @param commitment Commitment level
     * @param finality Finality level
     * @returns Transaction result
     */
    async createAndBuyV2(creator, mint, metadata, buyAmountSol, isMayhemMode = false, slippageBasisPoints = 500n, priorityFees, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) {
        const tokenMetadata = await this.sdk.token.createTokenMetadata(metadata);
        const createIx = await this.getCreateV2Instructions(creator.publicKey, metadata.name, metadata.symbol, tokenMetadata.metadataUri, mint, isMayhemMode);
        const transaction = new Transaction().add(createIx);
        if (buyAmountSol > 0n) {
            const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
            const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
            const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
            await this.buildBuyIx(creator.publicKey, mint.publicKey, buyAmount, buyAmountWithSlippage, transaction, commitment, true);
        }
        return await sendTx(this.sdk.connection, transaction, creator.publicKey, [creator, mint], priorityFees, commitment, finality);
    }
    async buildSellIx(seller, mint, tokenAmount, minSolOutput, tx, commitment) {
        const bondingCurve = this.sdk.pda.getBondingCurvePDA(mint);
        const associatedBonding = await getAssociatedTokenAddress(mint, bondingCurve, true);
        const associatedUser = await this.sdk.token.createAssociatedTokenAccountIfNeeded(seller, seller, mint, tx, commitment);
        const globalPda = this.sdk.pda.getGlobalAccountPda();
        const globalBuf = await this.sdk.connection.getAccountInfo(globalPda, commitment);
        const feeRecipient = GlobalAccount.fromBuffer(globalBuf.data).feeRecipient;
        const bondingCreator = await this.sdk.token.getBondingCurveCreator(bondingCurve, commitment);
        const creatorVault = this.sdk.pda.getCreatorVaultPda(bondingCreator);
        const eventAuthority = this.sdk.pda.getEventAuthorityPda();
        const ix = await this.sdk.program.methods
            .sell(new BN(tokenAmount.toString()), new BN(minSolOutput.toString()))
            .accounts({
            global: globalPda,
            feeRecipient,
            mint,
            bondingCurve,
            associatedBondingCurve: associatedBonding,
            associatedUser,
            user: seller,
            creatorVault,
            eventAuthority,
            feeConfig: this.sdk.pda.getPumpFeeConfigPda(),
        })
            .instruction();
        tx.add(ix);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, priorityFees, commitment = DEFAULT_COMMITMENT, finality = DEFAULT_FINALITY) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        return await sendTx(this.sdk.connection, transaction, seller.publicKey, [seller], priorityFees, commitment, finality);
    }
    async getSellInstructionsByTokenAmount(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.buildSellIx(seller, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        return transaction;
    }
}

class PdaModule {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    getCreatorVaultPda(creator) {
        return PublicKey.findProgramAddressSync([Buffer.from("creator-vault"), creator.toBuffer()], this.sdk.program.programId)[0];
    }
    getGlobalAccountPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_ACCOUNT_SEED)], this.sdk.program.programId)[0];
    }
    getEventAuthorityPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(EVENT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getBondingCurvePDA(mint, tokenProgram = LEGACY_TOKEN_PROGRAM_ID) {
        return PublicKey.findProgramAddressSync([Buffer.from(BONDING_CURVE_SEED), mint.toBuffer(), tokenProgram.toBuffer()], this.sdk.program.programId)[0];
    }
    getMintAuthorityPDA() {
        return PublicKey.findProgramAddressSync([Buffer.from(MINT_AUTHORITY_SEED)], this.sdk.program.programId)[0];
    }
    getPumpFeeConfigPda() {
        return PublicKey.findProgramAddressSync([Buffer.from("fee_config"), PUMP_PROGRAM_ID.toBuffer()], PUMP_FEE_PROGRAM_ID)[0];
    }
    getMetadataPDA(mint) {
        const metadataProgram = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
        const [metadataPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_SEED), metadataProgram.toBuffer(), mint.toBuffer()], metadataProgram);
        return metadataPDA;
    }
    getGlobalVolumeAccumulatorPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_VOLUME_SEED)], this.sdk.program.programId)[0];
    }
    getUserVolumeAccumulatorPda(user) {
        return PublicKey.findProgramAddressSync([Buffer.from(USER_VOLUME_SEED), user.toBuffer()], this.sdk.program.programId)[0];
    }
    // Mayhem mode PDAs (Breaking change Nov 11, 2025)
    getMayhemStatePda(mint) {
        return PublicKey.findProgramAddressSync([Buffer.from(MAYHEM_STATE_SEED), mint.toBuffer()], MAYHEM_PROGRAM_ID)[0];
    }
    getGlobalParamsPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_PARAMS_SEED)], MAYHEM_PROGRAM_ID)[0];
    }
    getSolVaultPda() {
        return PublicKey.findProgramAddressSync([Buffer.from(SOL_VAULT_SEED)], MAYHEM_PROGRAM_ID)[0];
    }
    getMayhemTokenVaultPda(mint) {
        const solVault = this.getSolVaultPda();
        const TOKEN_2022_PROGRAM = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
        // This is an Associated Token Account PDA for the sol vault
        return PublicKey.findProgramAddressSync([solVault.toBuffer(), TOKEN_2022_PROGRAM.toBuffer(), mint.toBuffer()], new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL") // Associated Token Program
        )[0];
    }
}

const ACCOUNTS = [
    new PublicKey("96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5"),
    new PublicKey("DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"),
    new PublicKey("DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL"),
    new PublicKey("ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49"),
    new PublicKey("Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY"),
    new PublicKey("ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt"),
    new PublicKey("HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe"),
    new PublicKey("3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"),
];
function getRandomJitoTipAccount() {
    const randomIndex = Math.floor(Math.random() * ACCOUNTS.length);
    return ACCOUNTS[randomIndex];
}

class JitoModule {
    sdk;
    client;
    constructor(sdk, endpoint, authKeypair) {
        this.sdk = sdk;
        if (!endpoint) {
            throw new Error("Jito endpoint is required");
        }
        this.client = searcherClient(endpoint, authKeypair);
    }
    async buyJito(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addJitoTip(buyer, transaction, jitoTip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendJitoTx(signedTx);
    }
    async sellJito(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, jitoTip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addJitoTip(seller, transaction, jitoTip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendJitoTx(signedTx);
    }
    addJitoTip(buyer, transaction, jitoTip = 500000) {
        if (jitoTip <= 0) {
            return transaction;
        }
        const jitoTipAccount = getRandomJitoTipAccount();
        const jitoTipInstruction = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: jitoTipAccount,
            lamports: jitoTip,
        });
        transaction.add(jitoTipInstruction);
        return transaction;
    }
    async sendJitoTx(tx) {
        const b = new Bundle([tx], 1);
        const res = await this.client.sendBundle(b);
        if (res.ok) {
            return {
                success: true,
                bundleId: res.value,
            };
        }
        return {
            success: false,
            error: res.error,
        };
    }
}

class AgentRegistry {
    static agents = {};
    static config = new Map();
    /** Lazy-create & memoize */
    static get(key) {
        if (!this.agents[key]) {
            const config = this.config[key];
            const isHttps = config.port === 443;
            this.agents[key] = isHttps
                ? new https.Agent({
                    keepAlive: true,
                    keepAliveMsecs: 60_000,
                    maxSockets: 6, // tune per host
                    maxFreeSockets: 6,
                })
                : new http.Agent({
                    keepAlive: true,
                    keepAliveMsecs: 60_000,
                    maxSockets: 6, // tune per host
                    maxFreeSockets: 6,
                });
            // wireAgentDebug(this.agents[key]!, key);
        }
        return this.agents[key];
    }
    static registerInConfig(key, region) {
        if (this.config.has(key)) {
            throw new Error(`Host key ${key} is already registered.`);
        }
        switch (key) {
            case "slot":
                this.config.set(key, {
                    host: SLOT_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "node":
                this.config.set(key, {
                    host: NODE1_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "nextBlock":
                this.config.set(key, {
                    host: NEXTBLOCK_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            case "astra":
                this.config.set(key, {
                    host: ASTRA_ENDPOINT_BY_REGION[region],
                    port: 80,
                });
                break;
            default:
                throw new Error(`Unknown host key: ${key}`);
        }
    }
    static deleteFromConfig(key) {
        if (!this.config.has(key)) {
            throw new Error(`Host key ${key} is not registered.`);
        }
        this.config.delete(key);
        delete this.agents[key];
    }
    static target(key) {
        return this.config[key];
    }
    static callUpstream(key, path, options = {}) {
        return new Promise((resolve, reject) => {
            const { host, port } = this.target(key);
            const agent = this.get(key);
            const isHttps = port === 443;
            const requestOptions = {
                hostname: host,
                path: path,
                port: port,
                method: options.method || "GET",
                headers: options.headers || {},
                agent: agent,
                timeout: options.timeout || 5000, // 5 second timeout
            };
            const requestModule = isHttps ? https : http;
            const req = requestModule.request(requestOptions, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(data);
                    }
                    else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });
            req.on("socket", (sock) => {
                sock.setNoDelay(true);
            });
            req.on("error", (err) => {
                reject(err);
            });
            req.on("timeout", () => {
                req.destroy();
                reject(new Error("Request timeout"));
            });
            // Write body if provided
            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }
}

class AstraModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("astra", region);
        this.key = key;
    }
    ASTRA_ACCOUNTS = [
        new PublicKey("astrazznxsGUhWShqgNtAdfrzP2G83DzcWVJDxwV9bF"),
        new PublicKey("astra4uejePWneqNaJKuFFA8oonqCE1sqF6b45kDMZm"),
        new PublicKey("astra9xWY93QyfG6yM8zwsKsRodscjQ2uU2HKNL5prk"),
        new PublicKey("astraRVUuTHjpwEVvNBeQEgwYx9w9CFyfxjYoobCZhL"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.ASTRA_ACCOUNTS.length);
        return this.ASTRA_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addTip(buyer, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addTip(seller, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.callUpstream("astra", `/iris?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(getHealthBody),
            },
            body: getHealthBody,
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const UUID = crypto.randomUUID();
        const txbody = JSON.stringify({
            jsonrpc: "2.0",
            id: UUID,
            method: "sendTransaction",
            params: [tx, { encoding: "base64", skipPreflight: true, maxRetries: 0 }],
        });
        return await AgentRegistry.callUpstream("astra", `/iris?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
            },
            body: txbody,
        });
    }
}

class SlotModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("slot", region);
        this.key = key;
    }
    SLOT_ACCOUNTS = [
        new PublicKey("Eb2KpSC8uMt9GmzyAEm5Eb1AAAgTjRaXWFjKyFXHZxF3"),
        new PublicKey("FCjUJZ1qozm1e8romw216qyfQMaaWKxWsuySnumVCCNe"),
        new PublicKey("ENxTEjSQ1YabmUpXAdCgevnHQ9MHdLv8tzFiuiYJqa13"),
        new PublicKey("6rYLG55Q9RpsPGvqdPNJs4z5WTxJVatMB8zV3WJhs5EK"),
        new PublicKey("Cix2bHfqPcKcM233mzxbLk14kSggUUiz2A87fJtGivXr"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.SLOT_ACCOUNTS.length);
        return this.SLOT_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addTip(buyer, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addTip(seller, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.callUpstream("slot", `/?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(getHealthBody),
            },
            body: getHealthBody,
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const UUID = crypto.randomUUID();
        const txbody = JSON.stringify({
            jsonrpc: "2.0",
            id: UUID,
            method: "sendTransaction",
            params: [tx, { encoding: "base64", skipPreflight: true, maxRetries: 0 }],
        });
        return await AgentRegistry.callUpstream("slot", `/?api-key=${this.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
            },
            body: txbody,
        });
    }
}

class NextBlockModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("nextBlock", region);
        this.key = key;
    }
    NEXT_BLOCK_ACCOUNTS = [
        new PublicKey("NextbLoCkVtMGcV47JzewQdvBpLqT9TxQFozQkN98pE"),
        new PublicKey("NexTbLoCkWykbLuB1NkjXgFWkX9oAtcoagQegygXXA2"),
        new PublicKey("NeXTBLoCKs9F1y5PJS9CKrFNNLU1keHW71rfh7KgA1X"),
        new PublicKey("NexTBLockJYZ7QD7p2byrUa6df8ndV2WSd8GkbWqfbb"),
        new PublicKey("neXtBLock1LeC67jYd1QdAa32kbVeubsfPNTJC1V5At"),
        new PublicKey("nEXTBLockYgngeRmRrjDV31mGSekVPqZoMGhQEZtPVG"),
        new PublicKey("NEXTbLoCkB51HpLBLojQfpyVAMorm3zzKg7w9NFdqid"),
        new PublicKey("nextBLoCkPMgmG8ZgJtABeScP35qLa2AMCNKntAP7Xc"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.NEXT_BLOCK_ACCOUNTS.length);
        return this.NEXT_BLOCK_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addTip(buyer, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addTip(seller, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.callUpstream("nextBlock", "/api/v2/submit", {
            method: "GET",
            headers: {
                Authorization: this.key,
            },
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const txbody = JSON.stringify({ transaction: { content: tx } });
        return await AgentRegistry.callUpstream("nextBlock", `/api/v2/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
                Authorization: this.key,
            },
            body: txbody,
        });
    }
}

class NodeOneModule {
    sdk;
    key;
    constructor(sdk, region, key) {
        this.sdk = sdk;
        AgentRegistry.registerInConfig("node", region);
        this.key = key;
    }
    NODE_ONE_ACCOUNTS = [
        new PublicKey("node1PqAa3BWWzUnTHVbw8NJHC874zn9ngAkXjgWEej"),
        new PublicKey("node1UzzTxAAeBTpfZkQPJXBAqixsbdth11ba1NXLBG"),
        new PublicKey("node1Qm1bV4fwYnCurP8otJ9s5yrkPq7SPZ5uhj3Tsv"),
        new PublicKey("node1PUber6SFmSQgvf2ECmXsHP5o3boRSGhvJyPMX1"),
        new PublicKey("node1AyMbeqiVN6eoQzEAwCA6Pk826hrdqdAHR7cdJ3"),
        new PublicKey("node1YtWCoTwwVYTFLfS19zquRQzYX332hs1HEuRBjC"),
        new PublicKey("node1FdMPnJBN7QTuhzNw3VS823nxFuDTizrrbcEqzp"),
    ];
    getRandomAccount() {
        const randomIndex = Math.floor(Math.random() * this.NODE_ONE_ACCOUNTS.length);
        return this.NODE_ONE_ACCOUNTS[randomIndex];
    }
    async buy(buyer, mint, buyAmountSol, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount) {
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        }
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const buyAmount = bondingAccount.getBuyPrice(globalAccount, feeConfig, buyAmountSol);
        const buyAmountWithSlippage = calculateWithSlippageBuy(buyAmountSol, slippageBasisPoints);
        const transaction = new Transaction();
        await this.sdk.trade.buildBuyIx(buyer.publicKey, mint, buyAmount, buyAmountWithSlippage, transaction, commitment, false);
        this.addTip(buyer, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, buyer.publicKey, commitment, [buyer]);
        return await this.sendTransaction(signedTx);
    }
    async sell(seller, mint, sellTokenAmount, slippageBasisPoints = 500n, tip = 500000, priorityFees, commitment = DEFAULT_COMMITMENT) {
        const bondingAccount = await this.sdk.token.getBondingCurveAccount(mint, commitment);
        if (!bondingAccount)
            throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
        const globalAccount = await this.sdk.token.getGlobalAccount(commitment);
        const feeConfig = await this.sdk.token.getFeeConfig(commitment);
        const minSolOutput = bondingAccount.getSellPrice(globalAccount, feeConfig, sellTokenAmount);
        let sellAmountWithSlippage = calculateWithSlippageSell(minSolOutput, slippageBasisPoints);
        if (sellAmountWithSlippage < 1n)
            sellAmountWithSlippage = 1n;
        const transaction = new Transaction();
        await this.sdk.trade.buildSellIx(seller.publicKey, mint, sellTokenAmount, sellAmountWithSlippage, transaction, commitment);
        this.addTip(seller, transaction, tip);
        const signedTx = await buildSignedTx(priorityFees, transaction, this.sdk.connection, seller.publicKey, commitment, [seller]);
        return await this.sendTransaction(signedTx);
    }
    addTip(buyer, transaction, tip = 500000) {
        if (tip <= 0) {
            return transaction;
        }
        const tipAccount = this.getRandomAccount();
        const tipInstructions = SystemProgram.transfer({
            fromPubkey: buyer.publicKey,
            toPubkey: tipAccount,
            lamports: tip,
        });
        transaction.add(tipInstructions);
        return transaction;
    }
    async ping() {
        return await AgentRegistry.callUpstream("node", "/ping", {
            method: "GET",
        });
    }
    async sendTransaction(vertionedTx) {
        const serealized = vertionedTx.serialize();
        const tx = Buffer.from(serealized).toString("base64");
        const UUID = crypto.randomUUID();
        const txbody = JSON.stringify({
            jsonrpc: "2.0",
            id: UUID,
            method: "sendTransaction",
            params: [tx, { encoding: "base64", skipPreflight: true, maxRetries: 0 }],
        });
        return await AgentRegistry.callUpstream("node", `/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(txbody),
                "api-key": this.key,
            },
            body: txbody,
        });
    }
}

class PumpFunSDK {
    program;
    connection;
    token;
    trade;
    pda;
    jito;
    astra;
    slot;
    nextBlock;
    nodeOne;
    events;
    constructor(provider, options) {
        this.program = new Program(IDL, provider);
        this.connection = this.program.provider.connection;
        // Initialize modules
        this.token = new TokenModule(this);
        this.trade = new TradeModule(this);
        this.events = new EventModule(this);
        this.pda = new PdaModule(this);
        if (options?.jitoUrl) {
            this.jito = new JitoModule(this, options.jitoUrl, options.authKeypair);
        }
        if (options?.astraKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for Astra module.");
            }
            this.astra = new AstraModule(this, options.providerRegion, options.astraKey);
        }
        if (options?.slotKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for 0Slot module.");
            }
            this.slot = new SlotModule(this, options.providerRegion, options.slotKey);
        }
        if (options?.nextBlockKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NextBlock module.");
            }
            this.nextBlock = new NextBlockModule(this, options.providerRegion, options.nextBlockKey);
        }
        if (options?.nodeOneKey) {
            if (!options.providerRegion) {
                throw new Error("Provider region is required for NodeOne module.");
            }
            this.nodeOne = new NodeOneModule(this, options.providerRegion, options.nodeOneKey);
        }
    }
}

export { ASTRA_ENDPOINT_BY_REGION, AstraModule, BONDING_CURVE_SEED, BondingCurveAccount, DEFAULT_COMMITMENT, DEFAULT_DECIMALS, DEFAULT_FINALITY, EVENT_AUTHORITY_SEED, EventModule, GLOBAL_ACCOUNT_SEED, GLOBAL_PARAMS_SEED, GLOBAL_VOLUME_SEED, GlobalAccount, JitoModule, LEGACY_TOKEN_PROGRAM_ID, MAYHEM_FEE_RECIPIENT, MAYHEM_PROGRAM_ID, MAYHEM_STATE_SEED, METADATA_SEED, MINT_AUTHORITY_SEED, MPL_TOKEN_METADATA_PROGRAM_ID, NEXTBLOCK_ENDPOINT_BY_REGION, NODE1_ENDPOINT_BY_REGION, NextBlockModule, NodeOneModule, PUMP_FEE_PROGRAM_ID, PUMP_PROGRAM_ID, PumpFunSDK, Region, SLOT_ENDPOINT_BY_REGION, SOL_VAULT_SEED, SlotModule, TOKEN_2022_PROGRAM_ID, TokenModule, TradeModule, USER_VOLUME_SEED, buildSignedTx, buildVersionedTx, calculateWithSlippageBuy, calculateWithSlippageSell, converters, getHealthBody, getTxDetails, sendTx, toCollectCreatorFeeEvent, toCompleteEvent, toCompletePumpAmmMigrationEvent, toCreateEvent, toExtendAccountEvent, toSetCreatorEvent, toSetMetaplexCreatorEvent, toSetParamsEvent, toTradeEvent, toUpdateGlobalAuthorityEvent };
//# sourceMappingURL=index.js.map
