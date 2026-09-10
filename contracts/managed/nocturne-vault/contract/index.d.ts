import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  createVault(context: __compactRuntime.CircuitContext<PS>,
              ownerCommitment_0: Uint8Array,
              initialSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  heartbeat(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claimVault(context: __compactRuntime.CircuitContext<PS>,
             revealedSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  revokeVault(context: __compactRuntime.CircuitContext<PS>,
              revocationNotice_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createVault(context: __compactRuntime.CircuitContext<PS>,
              ownerCommitment_0: Uint8Array,
              initialSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  heartbeat(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claimVault(context: __compactRuntime.CircuitContext<PS>,
             revealedSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  revokeVault(context: __compactRuntime.CircuitContext<PS>,
              revocationNotice_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createVault(context: __compactRuntime.CircuitContext<PS>,
              ownerCommitment_0: Uint8Array,
              initialSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  heartbeat(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  claimVault(context: __compactRuntime.CircuitContext<PS>,
             revealedSecret_0: string): __compactRuntime.CircuitResults<PS, []>;
  revokeVault(context: __compactRuntime.CircuitContext<PS>,
              revocationNotice_0: string): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly vaultActive: boolean;
  readonly vaultOwnerCommitment: Uint8Array;
  readonly secretPayload: string;
  readonly heartbeats: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
