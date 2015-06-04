import { BindingRecord } from './binding_record';
import { DirectiveIndex } from './directive_record';
export declare const RECORD_TYPE_SELF: number;
export declare const RECORD_TYPE_CONST: number;
export declare const RECORD_TYPE_PRIMITIVE_OP: number;
export declare const RECORD_TYPE_PROPERTY: number;
export declare const RECORD_TYPE_LOCAL: number;
export declare const RECORD_TYPE_INVOKE_METHOD: number;
export declare const RECORD_TYPE_INVOKE_CLOSURE: number;
export declare const RECORD_TYPE_KEYED_ACCESS: number;
export declare const RECORD_TYPE_PIPE: number;
export declare const RECORD_TYPE_BINDING_PIPE: number;
export declare const RECORD_TYPE_INTERPOLATE: number;
export declare class ProtoRecord {
    mode: number;
    name: string;
    funcOrValue: any;
    args: List<any>;
    fixedArgs: List<any>;
    contextIndex: number;
    directiveIndex: DirectiveIndex;
    selfIndex: number;
    bindingRecord: BindingRecord;
    expressionAsString: string;
    lastInBinding: boolean;
    lastInDirective: boolean;
    constructor(mode: number, name: string, funcOrValue: any, args: List<any>, fixedArgs: List<any>, contextIndex: number, directiveIndex: DirectiveIndex, selfIndex: number, bindingRecord: BindingRecord, expressionAsString: string, lastInBinding: boolean, lastInDirective: boolean);
    isPureFunction(): boolean;
}
export declare var __esModule: boolean;
