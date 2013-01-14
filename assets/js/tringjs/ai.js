/* APPLIANCE AI.
 *
 * Tring Project, Victoria University.
 *
 * Authors:
 * Richard Roberts,
 * Byron Mallet
 * Steven Lam
 */

ai = {

    sigma: 0.15,
    accuracy: 0.001,
    verbose: 0,

    dSpike: 0.9,
    dActive: 0.1,

    kernels : {

        exp: function(v) {
            var value = (numeric.pow(v, 2) * -1.0) / (2.0 * ai.sigma * ai.sigma);
            return numeric.exp(value);
        }

    },

    utils : {

        formatTimeStr: function (timeNumber) {
            var timeStr = timeNumber + '';
            while (timeStr.length < 4) {
                timeStr = '0' + timeStr;
            }
            return timeStr;
        },

        dist: function(a, b) {
            if (a.length != b.length) {
                console.log('ai.utis.dist() - ERROR: length of vectors a and b are not equal.');
            }

            var diffs = new Array();
            for (var n = 0; n < a.length; n++) {
                diffs.push(a[n] - b[n]);
            }

            // Return the square root of the sum of the squares of diffs
            return numeric.norm2(diffs);
        },

        interpColumn: function(col, inputs, weights, kernel) {
            var row = new Array();
            for (var n = 0; n < numeric.dim(inputs)[0]; n++) {
                row[n] = kernel(this.dist(col, inputs[n]));
            }

            return numeric.dot(row, weights);
        },

        buildAMatrix: function(inputs, kernel) {
            var npts = numeric.dim(inputs)[0];
            var aMatrix = numeric.identity(npts);

            for (var i = 0; i < npts; i++) {
                for (var j = 0; j < npts; j++) {
                    aMatrix[i][j] = kernel(this.dist(inputs[i], inputs[j]));
                }
            }
            return aMatrix;
        },

        solve: function(aMatrix, outputs) {
            var weights = numeric.dot(numeric.inv(aMatrix), outputs);
            return weights;
        },

        validate: function(inputs, outputs, weights, kernel) {
            var npts = numeric.dim(inputs)[0]
            var ndim = numeric.dim(outputs)[1]

            var matrixOk = true;
            for (var n = 0; n < npts; n++) {
                var predicted = ai.utils.interpColumn(inputs[n], inputs, weights, kernel)

                if (ai.verbose > 2) {
                    console.log('\twanted', numeric.prettyPrint(outputs[n]));
                    console.log('\tgot', numeric.prettyPrint(predicted), '\n');
                }

                for (var i = 0; i < outputs[n].length; i++) {
                    matrixOk = (outputs[n][i] > predicted[i] - ai.accuracy && outputs[n][i] < predicted[i] + ai.accuracy && matrixOk);
                }
            }

            if (ai.verbose > 0) {
                if (ai.verbose > 1) {
                    console.log('inputs.shape = ',  numeric.dim(inputs));
                    console.log('outputs.shape = ', numeric.dim(outputs));
                    console.log('weights.shape = ', numeric.dim(weights));
                }
                console.log("Matrix is", matrixOk ? "correct" : "incorrect");
            }
        }
    },

    Learner: function(kernel) {

        this.inputs = new Array();
        this.outputs = new Array();
        this.aMatrix = null;
        this.weights = null;
        this.kernel = kernel;

        this.addTrainingPoint = function(ins, outs) {
            this.inputs.push(ins);
            this.outputs.push(outs);
        }

        this.setup = function() {
            this.aMatrix = ai.utils.buildAMatrix(this.inputs, this.kernel);
            this.weights = ai.utils.solve(this.aMatrix, this.outputs);
        }

        this.validate = function() {
            ai.utils.validate(this.inputs, this.outputs, this.weights, this.kernel);
        }

        this.getValue = function(time, power, last) {
            var tod = ai.info.indexFromTime(time) / 48.0;
            var powerUse = power / 5.0;
            var factor = last / 5.0;
            return ai.utils.interpColumn([tod, powerUse, factor], this.inputs, this.weights, this.kernel);
        }

        this.addPoint = function(time, power, last, appSet) {
            var tod = ai.info.indexFromTime(time) / 48.0;
            var powerUse = power / 5.0;
            var factor = last / 5.0;
            this.addTrainingPoint([tod, powerUse, factor], appSet);
        }

        this.trainBasic = function() {
            this.addPoint('0950', 1.6340, 0.4735, [0.000, 0.000, 0.857, 0.001, 0.000, 0.000, 0.143]);
            this.addPoint('1350', 1.7840, 0.4465, [0.000, 0.028, 0.841, 0.001, 0.000, 0.000, 0.131]);
            this.addPoint('2050', 1.3200, 0.2950, [0.000, 0.000, 0.379, 0.417, 0.027, 0.000, 0.177]);
            this.addPoint('1250', 0.4500, 0.2340, [0.000, 0.000, 0.000, 0.476, 0.000, 0.000, 0.524]);

            this.addPoint('2150', 0.2950, 1.5450, [0.085, 0.000, 0.000, 0.001, 0.122, 0.000, 0.793]);
            this.addPoint('1600', 0.6090, 0.2840, [0.000, 0.082, 0.000, 0.001, 0.000, 0.533, 0.384]);
            this.addPoint('1850', 0.2770, 0.2680, [0.090, 0.000, 0.000, 0.001, 0.065, 0.000, 0.845]);
            this.addPoint('2000', 0.2950, 0.2860, [0.085, 0.000, 0.000, 0.001, 0.122, 0.000, 0.793]);

            this.addPoint('2250', 0.2520, 0.2700, [0.000, 0.000, 0.000, 0.001, 0.071, 0.000, 0.929]);
            this.addPoint('0000', 0.2340, 0.2340, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);
            this.addPoint('0400', 0.2340, 0.2340, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);
            this.addPoint('0800', 0.2340, 0.2340, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);

            this.addPoint('1200', 0.2340, 0.4380, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);
            this.addPoint('1600', 0.2340, 0.2840, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);
            this.addPoint('2000', 0.2340, 0.2860, [0.000, 0.000, 0.000, 0.001, 0.000, 0.000, 1.000]);
        }
    },

    info: {

        
        timeFromIndex: function(index) {
            return ai.utils.formatTimeStr(index * 50);
        },

        indexFromTime: function(timeStr) {
            for (var i = 0; i < 48; i++) {
                var cTime = ai.utils.formatTimeStr(i * 50);

                if (cTime == timeStr) {
                    return i;
                }
            } 

            return -1;
        },

        appFromIndex: function(index, pretty) {
            var appliances = ['entertainment', 'heating', 'kitchen', 'laundry', 'lighting', 'utility', 'constant'];
            var appliancesPretty = [
                'entertainment',
                'heating      ',
                'kitchen      ',
                'laundry      ',
                'lighting     ',
                'utility      ',
                'constant     '];

            if (pretty) {
                return appliancesPretty[index];
            } else {
                return appliances[index];
            }
        }

    }

}