// test.mjs
import { expect } from 'chai';
import server from './server.js'; 

const { convertToCommonUnit, convertFromCommonUnit } = server;

describe('Conversion Functions', () => {
    describe('convertToCommonUnit', () => {
        it('should convert feet to meters', () => {
            const result = convertToCommonUnit(10, 'feet', {
                feet: 0.3048,
                inches: 0.0254,
                miles: 1609.34,
                kilometers: 1000,
                meters: 1,
                centimeters: 0.01,
            });
            expect(result).to.be.closeTo(3.048, 0.001);
        });

        it('should convert pounds to kilograms', () => {
            const result = convertToCommonUnit(10, 'pounds', {
                pounds: 0.454,
                kilograms: 1,
            });
            expect(result).to.be.closeTo(4.54, 0.01);
        });
    });

    describe('convertFromCommonUnit', () => {
        it('should convert meters to feet', () => {
            const result = convertFromCommonUnit(3.048, 'feet', {
                feet: 0.3048,
                inches: 0.0254,
                miles: 1609.34,
                kilometers: 1000,
                meters: 1,
                centimeters: 0.01,
            });
            expect(result).to.be.closeTo(10, 0.001);
        });

        it('should convert kilograms to pounds', () => {
            const result = convertFromCommonUnit(4.54, 'pounds', {
                pounds: 0.454,
                kilograms: 1,
            });
            expect(result).to.be.closeTo(10, 0.01);
        });
    });
});